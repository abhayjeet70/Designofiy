/**
 * SlideUpText — ported from 21st.dev/r/slide-up-text for plain React + Vite.
 * No TypeScript · No Tailwind · No shadcn
 *
 * Usage:
 *   <SlideUpText split="words" stagger={0.06}>Some heading text</SlideUpText>
 *   <SlideUpText split="characters" stagger={0.03} delay={0.1}>Another line</SlideUpText>
 *
 * Props:
 *   children     – string text to animate
 *   split        – "words" | "characters" | "lines"   (default: "words")
 *   delay        – initial delay in seconds            (default: 0)
 *   stagger      – per-unit delay in seconds           (default: 0.08)
 *   from         – "first" | "last" | "center"         (default: "first")
 *   autoStart    – start on mount                      (default: true)
 *   inView       – trigger when element enters viewport (default: false)
 *   once         – only animate once in inView mode    (default: true)
 *   onStart      – callback when animation begins
 *   onComplete   – callback when animation finishes
 *   className    – extra class on the wrapper span
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { motion } from 'motion/react'

/* ── helpers ── */
function splitIntoCharacters(str) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('en', { granularity: 'grapheme' })
    return Array.from(seg.segment(str), ({ segment }) => segment)
  }
  return Array.from(str)
}

/* ── component ── */
const SlideUpText = forwardRef(function SlideUpText(
  {
    children,
    split = 'words',
    delay = 0,
    stagger = 0.08,
    from = 'first',
    transition = { type: 'tween', ease: [0.625, 0.05, 0, 1], duration: 0.55 },
    className = '',
    autoStart = true,
    inView = false,
    once = true,
    onStart,
    onComplete,
    ...rest
  },
  ref,
) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const [isAnimating, setIsAnimating] = useState(false)

  /* Build element list */
  const elements = useMemo(() => {
    const words = text.split(' ')
    if (split === 'characters') {
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }))
    }
    if (split === 'words') {
      return words.map((word, i) => ({
        characters: [word],
        needsSpace: i !== words.length - 1,
      }))
    }
    // lines
    return text.split('\n').map((line, i, arr) => ({
      characters: [line],
      needsSpace: false,
      isLine: true,
    }))
  }, [text, split])

  /* Total unit count for stagger direction */
  const totalUnits = useMemo(
    () =>
      elements.reduce(
        (acc, el) => acc + el.characters.length + (el.needsSpace ? 1 : 0),
        0,
      ),
    [elements],
  )

  const getStaggerDelay = useCallback(
    (index) => {
      if (from === 'first') return index * stagger
      if (from === 'last') return (totalUnits - 1 - index) * stagger
      if (from === 'center') {
        const center = Math.floor(totalUnits / 2)
        return Math.abs(center - index) * stagger
      }
      return index * stagger
    },
    [from, stagger, totalUnits],
  )

  const startAnimation = useCallback(() => {
    setIsAnimating(true)
    onStart?.()
  }, [onStart])

  useImperativeHandle(ref, () => ({
    startAnimation,
    reset: () => setIsAnimating(false),
  }))

  useEffect(() => {
    if (autoStart && !inView) startAnimation()
  }, [autoStart, inView, startAnimation])

  const variants = {
    hidden: { y: '105%' },
    visible: (i) => ({
      y: 0,
      transition: {
        ...transition,
        delay: delay + (transition?.delay ?? 0) + getStaggerDelay(i),
      },
    }),
  }

  /* Running char index across all words */
  let globalIdx = 0

  return (
    <motion.span
      className={`sut-wrap${className ? ' ' + className : ''}`}
      style={{
        display: 'inline-flex',
        flexWrap: split === 'lines' ? 'nowrap' : 'wrap',
        flexDirection: split === 'lines' ? 'column' : 'row',
        whiteSpace: 'pre-wrap',
        verticalAlign: 'top',
      }}
      initial="hidden"
      whileInView={inView ? 'visible' : undefined}
      animate={inView ? undefined : isAnimating ? 'visible' : 'hidden'}
      viewport={{ once }}
      onAnimationStart={() => {
        if (inView) {
          setIsAnimating(true)
          onStart?.()
        }
      }}
      {...rest}
    >
      {/* Screen-reader copy */}
      <span
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clipPath: 'inset(50%)',
        }}
      >
        {text}
      </span>

      {elements.map((wordObj, wordIndex, array) => {
        const wordStartIdx = globalIdx

        const el = (
          <span
            key={wordIndex}
            aria-hidden="true"
            style={{ display: 'inline-flex', overflow: 'hidden', lineHeight: 'inherit' }}
          >
            {wordObj.characters.map((char, charIndex) => {
              const unitIdx = globalIdx++
              return (
                <span
                  key={charIndex}
                  style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', lineHeight: 'inherit' }}
                >
                  <motion.span
                    custom={unitIdx}
                    initial="hidden"
                    animate={isAnimating ? 'visible' : 'hidden'}
                    variants={variants}
                    onAnimationComplete={
                      wordIndex === array.length - 1 &&
                      charIndex === wordObj.characters.length - 1
                        ? onComplete
                        : undefined
                    }
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                </span>
              )
            })}

            {/* The space collapses to zero width without this: as a flex item the
                span is blockified, so the lone " " becomes leading whitespace and
                is dropped. white-space:pre keeps it at its natural width. */}
            {wordObj.needsSpace && (
              <span style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', whiteSpace: 'pre' }}>
                <motion.span
                  custom={globalIdx++}
                  initial="hidden"
                  animate={isAnimating ? 'visible' : 'hidden'}
                  variants={variants}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {' '}
                </motion.span>
              </span>
            )}
          </span>
        )

        return el
      })}
    </motion.span>
  )
})

SlideUpText.displayName = 'SlideUpText'

export { SlideUpText }
export default SlideUpText
