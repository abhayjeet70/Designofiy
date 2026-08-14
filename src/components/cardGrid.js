import { useEffect, useState } from 'react'

// Keep these in sync with the .grid column-count breakpoints in styles.css.
const QUERIES = [
  { query: '(max-width: 720px)', cols: 1 },
  { query: '(max-width: 1080px)', cols: 2 },
]

function resolveCols() {
  if (typeof window === 'undefined') return 3
  for (const { query, cols } of QUERIES) {
    if (window.matchMedia(query).matches) return cols
  }
  return 3
}

export function useGridCols() {
  const [cols, setCols] = useState(resolveCols)
  useEffect(() => {
    const mqls = QUERIES.map(({ query }) => window.matchMedia(query))
    const update = () => setCols(resolveCols())
    mqls.forEach((mql) => mql.addEventListener('change', update))
    update()
    return () => mqls.forEach((mql) => mql.removeEventListener('change', update))
  }, [])
  return cols
}

// CSS auto-placement (sparse or dense) can't satisfy both "no orphaned gaps"
// and "every card snaps to the same row" at once once wide/tall spans are
// mixed in: sparse leaves a 2-wide card's unusable leftover column empty,
// dense fills it but by pulling a later card out of row order, which can
// land two unrelated cards' row-boundaries beside each other. Packing the
// grid explicitly sidesteps both: every card gets a real gridRow/gridCol,
// filling gaps by reordering just enough to avoid stranding a column.
export function packGrid(items, cols) {
  const occupied = new Set()
  const isFree = (r, c) => !occupied.has(`${r},${c}`)
  const reserve = (r, c, w, h) => {
    for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) occupied.add(`${r + dr},${c + dc}`)
  }
  const fits = (r, c, w, h) => {
    if (c + w - 1 > cols) return false
    for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) if (!isFree(r + dr, c + dc)) return false
    return true
  }

  const queue = items.map((item) => ({
    item,
    w: Math.min(item.span === 'wide' ? 2 : 1, cols),
    h: item.span === 'tall' ? 2 : 1,
  }))
  const placed = []
  let row = 1
  let col = 1

  while (queue.length) {
    while (!isFree(row, col)) {
      col++
      if (col > cols) { col = 1; row++ }
    }
    const head = queue[0]
    if (fits(row, col, head.w, head.h)) {
      placed.push({ ...head.item, gridRow: row, gridCol: col, w: head.w, h: head.h })
      reserve(row, col, head.w, head.h)
      queue.shift()
      col += head.w
      if (col > cols) { col = 1; row++ }
    } else {
      const swapIdx = queue.findIndex((q, i) => i > 0 && q.w === 1)
      if (swapIdx > 0) {
        const [pulled] = queue.splice(swapIdx, 1)
        queue.unshift(pulled)
      } else {
        col = 1
        row++
      }
    }
  }
  return placed
}
