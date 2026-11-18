"""Rebuild the woodland app edition from preserved source and authored stories."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'source/original'
helpers=json.loads((p/'helper_lessons.json').read_text())['lessons']
children={l['id']:l for l in json.loads((p/'child_pages.json').read_text())['lessons']}
stories={l['id']:l for l in json.loads((ROOT/'content/stories.json').read_text())}
assert set(stories)==set(children)
out=[]
for helper in helpers:
    ident=helper['id']; child=children[ident]; cards={c['kind']:c for c in helper['cards']}
    materials=[{**m,'optional':ident=='p05' and m['part_id']=='passive_piezo'} for m in helper['materials']]
    out.append({**stories[ident],'slug':helper['slug'],'track':helper['track'],'minutes':helper['duration_minutes'],'prerequisites':helper['prerequisites'],'board':helper['board'],'version':'woodland-1','image':child['pages'][0]['image'],'actionImage':child['pages'][2]['image'],'materials':materials,'buildText':child['pages'][2]['text'].replace('\n',' '),'exploreText':child['pages'][3]['text'].replace('\n',' '),'experiment':cards['explore'],'success':cards['test'],'debug':cards['debug'],'remix':cards['remix']['options'],'helper':helper})
(ROOT/'content/lessons.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
keys=['id','title','character','slug','track','minutes','prerequisites','board','image','materials','intro','preview']
(ROOT/'content/catalog.json').write_text(json.dumps([{k:l[k] for k in keys} for l in out],ensure_ascii=False,indent=2))
print('Imported 30 woodland editions. Original source unchanged.')
