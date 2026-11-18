from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
x=json.loads((R/'child_pages.json').read_text());h=json.loads((R/'helper_lessons.json').read_text())['lessons'];b=json.loads((R/'book_pages.json').read_text())['books'];ids={l['id'] for l in x['lessons']}
assert len(x['lessons'])==len(h)==30
assert len(x['tracks'])==len(b)==5
assert ids=={l['id'] for l in h}
for l in x['lessons']:
 assert len(l['pages'])==6
 assert set(l['prerequisites'])<=ids
 for p in l['pages']:
  assert p['text'].strip() and len(p['text'].split())<=40
  assert (R/p['image']['path']).is_file()
  assert 0<=p['image']['cell']<6
for book in b:
 assert len(book['pages'])==38
for l in h:
 assert len(next(c for c in l['cards'] if c['kind']=='build')['actions'])==7
 if l.get('code_path'):assert (R/l['code_path']).is_file(),l['code_path']
assert len(list((R/'code_samples').rglob('*.ino')))==16
print('PASS: 30 lessons, 180 short child pages, 5 books, complete helper steps, artwork and 16 sketch references.')
