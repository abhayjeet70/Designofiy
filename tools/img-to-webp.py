"""Convert public/**/*.png photography to WebP.

The site ships screenshot-grade PNGs of photographs; WebP at q82 is visually
indistinguishable at these sizes and roughly a tenth of the bytes. Run from the
repo root:  python tools/img-to-webp.py [--apply]

Without --apply it only reports what it would do. logo.png is skipped: it is a
small mark with hard edges and is referenced from index.html as the favicon.
"""
import os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..')
# logo.png: small hard-edged mark, also the favicon in index.html.
# hero_bg.png / materials.png: unreferenced dead files. hero_bg.png matters
# especially — converting it would emit hero_bg.webp and clobber the licensed
# hero backdrop that already lives at that name.
SKIP = {'logo.png', 'hero_bg.png', 'materials.png'}
MAX_W = 1600
QUALITY = 82
apply = '--apply' in sys.argv

total_before = total_after = 0
rows = []
for folder in ('public/work', 'public/hero'):
    d = os.path.join(ROOT, folder)
    if not os.path.isdir(d):
        continue
    for name in sorted(os.listdir(d)):
        if not name.endswith('.png') or name in SKIP:
            continue
        src = os.path.join(d, name)
        dst = src[:-4] + '.webp'
        before = os.path.getsize(src)
        im = Image.open(src).convert('RGB')
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        if apply:
            im.save(dst, 'WEBP', quality=QUALITY, method=6)
            after = os.path.getsize(dst)
        else:
            import io
            b = io.BytesIO(); im.save(b, 'WEBP', quality=QUALITY, method=6)
            after = b.tell()
        total_before += before; total_after += after
        rows.append((folder + '/' + name, before, after))

for n, b, a in rows:
    print(f'{b//1024:6d} KB -> {a//1024:5d} KB  {n}')
print(f'\n{len(rows)} files: {total_before/1048576:.2f} MB -> {total_after/1048576:.2f} MB '
      f'({(1-total_after/total_before)*100:.0f}% smaller)')
if not apply:
    print('\ndry run — pass --apply to write the .webp files')
