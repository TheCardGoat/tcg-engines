#!/usr/bin/env python3
"""Cluster reports by extracted card names and mechanic categories."""
import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path('/Users/wazar/projects/lorcana-simulator')
JSONL = ROOT / '.triage/reports.jsonl'
NAMES = ROOT / '.triage/card_names.json'
OUT = ROOT / '.triage/clusters.json'
TAGGED = ROOT / '.triage/tagged.jsonl'

MECHANIC_KEYWORDS = {
    'resist': 'resist', 'evasive': 'evasive', 'shift': 'shift', 'support': 'support',
    'challenge': 'challenge', 'challenger': 'challenger', 'rush': 'rush',
    'reckless': 'reckless', 'bodyguard': 'bodyguard', 'ward': 'ward',
    'singer': 'singer', 'song': 'song', 'banish': 'banish', 'ready': 'ready',
    'exert': 'exert', 'damage': 'damage', 'lore': 'lore', 'quest': 'quest',
    'ink': 'ink', 'discard': 'discard', 'deck': 'deck', 'draw': 'draw',
    'target': 'target', 'replay': 'replay',
}

UI_KEYWORDS = {
    'disconnect', 'disconnected', 'crash', 'crashed', 'freeze', 'frozen', 'stuck',
    "can't continue", 'skip', 'skipping', 'undo', 'button', 'click', 'tap',
    'graphics', 'visual', 'animation', 'loading', 'connection', 'reconnect',
    'logged out', 'kicked', 'lobby', 'matchmaking', 'save replay',
    'download replay', 'turn timer',
}

QUESTION_HINT = ('?', ' why ', ' how ', 'question', 'suggestion')

ALIAS_STOPLIST = {
    'you can', 'and then', 'this is', 'when you', 'pick a', 'be ', 'be king',
    'let it', 'three arrows', 'in the', 'on the', 'one of', 'all the',
    'as you', 'down to', 'tale as', 'do you', 'so much', 'into the',
    'home is', 'out for', 'take to', 'a new', 'a hero', 'the cards',
    'mine mine', 'never let', 'reach for', 'into a', 'go go', 'go to',
    'i will', 'we ll', 'is it', 'too much', 'time to', 'now we',
    'no need', 'how far', "how far i'll", "how far i'll go", "you can fly",
    'and then along came zeus',
}

# Popular single-token character first-names that are distinctive enough
# to identify a card reference on their own.
SINGLE_TOKEN_ALIASES = {
    'luisa': 'luisa madrigal', 'demona': 'demona', 'frozone': 'frozone',
    'bruno': 'bruno madrigal', 'elsa': 'elsa', 'belle': 'belle',
    'mickey': 'mickey mouse', 'donald': 'donald duck', 'goofy': 'goofy',
    'minnie': 'minnie mouse', 'maui': 'maui', 'moana': 'moana',
    'merlin': 'merlin', 'mim': 'madam mim', 'mulan': 'mulan',
    'aladdin': 'aladdin', 'jasmine': 'jasmine', 'genie': 'genie',
    'jafar': 'jafar', 'iago': 'iago', 'simba': 'simba', 'scar': 'scar',
    'nala': 'nala', 'pumbaa': 'pumbaa', 'timon': 'timon',
    'cinderella': 'cinderella', 'ariel': 'ariel', 'ursula': 'ursula',
    'eric': 'eric', 'flounder': 'flounder', 'tiana': 'tiana',
    'snow white': 'snow white', 'rapunzel': 'rapunzel', 'flynn': 'flynn',
    'pascal': 'pascal', 'gothel': 'mother gothel', 'megara': 'megara',
    'hades': 'hades', 'hercules': 'hercules', 'cruella': 'cruella',
    'pongo': 'pongo', 'perdita': 'perdita', 'pete': 'pete',
    'stitch': 'stitch', 'lilo': 'lilo', 'jumba': 'jumba', 'gantu': 'gantu',
    'pleakley': 'pleakley', 'kuzco': 'kuzco', 'pacha': 'pacha',
    'kronk': 'kronk', 'yzma': 'yzma', 'kida': 'kida', 'milo': 'milo',
    'rolo': 'rolo', 'tarzan': 'tarzan', 'jane': 'jane', 'kerchak': 'kerchak',
    'kala': 'kala', 'merida': 'merida', 'elinor': 'elinor',
    'fergus': 'fergus', 'morrigan': 'morrigan', 'sora': 'sora',
    'kairi': 'kairi', 'riku': 'riku', 'donald duck': 'donald duck',
    'pinocchio': 'pinocchio', 'geppetto': 'geppetto', 'jiminy': 'jiminy cricket',
    'aurora': 'aurora', 'maleficent': 'maleficent', 'flora': 'flora',
    'fauna': 'fauna', 'merryweather': 'merryweather', 'phillip': 'prince phillip',
    'tiger lily': 'tiger lily', 'wendy': 'wendy', 'hook': 'captain hook',
    'smee': 'smee', 'peter': 'peter pan', 'peter pan': 'peter pan',
    'tinker bell': 'tinker bell', 'tinkerbell': 'tinker bell',
    'jack sparrow': 'captain jack sparrow', 'sparrow': 'captain jack sparrow',
    'davy jones': 'davy jones', 'will turner': 'will turner',
    'elizabeth swann': 'elizabeth swann', 'barbossa': 'hector barbossa',
    'beast': 'beast', 'gaston': 'gaston', 'lefou': 'lefou',
    'mrs incredible': 'mrs incredible', 'mr incredible': 'mr incredible',
    'incredibles': 'incredibles', 'edna': 'edna mode', 'syndrome': 'syndrome',
    'violet parr': 'violet parr', 'violet': 'violet parr', 'dash': 'dash parr',
    'jack jack': 'jack jack', 'jackjack': 'jack jack', 'jack-jack': 'jack jack',
    'rapunzel': 'rapunzel', 'horned king': 'the horned king',
    'taran': 'taran', 'eilonwy': 'eilonwy', 'gurgi': 'gurgi',
    'cauldron': 'the black cauldron', 'omnidroid': 'omnidroid',
    'leviathan': 'the leviathan', 'arepas': 'julieta arepas',
    'julieta': 'julieta madrigal', 'mirabel': 'mirabel madrigal',
    'antonio': 'antonio madrigal', 'isabela': 'isabela madrigal',
    'dolores': 'dolores madrigal', 'felix': 'felix madrigal',
    'agustin': 'agustin madrigal', 'abuela alma': 'abuela alma',
    'horace horsecollar': 'horace horsecollar', 'horseman': "horseman's strike",
    "horseman's": "horseman's strike", 'bibbidi': 'bibbidi bobbidi boo',
    'roller bob': 'roller bob', 'hand in the box': 'hand in the box',
    'right behind you': 'right behind you', 'promising lead': 'promising lead',
    'helga sinclair': 'helga sinclair', 'helga': 'helga sinclair',
    'snow fort': 'snow fort', 'cheshire cat': 'cheshire cat',
    'diablo': 'diablo', 'baymax': 'baymax', 'hiro': 'hiro hamada',
    'chernabog': 'chernabog', 'alien': 'alien',
    'cheshire': 'cheshire cat', 'shan yu': 'shan yu', 'shan-yu': 'shan yu',
    'bibbity': 'bibbidi bobbidi boo', 'bibbity boppity': 'bibbidi bobbidi boo',
    'bibbidi': 'bibbidi bobbidi boo', 'bobbidi': 'bibbidi bobbidi boo',
    'hand in a box': 'hand in the box', 'hand in the box': 'hand in the box',
    "can't hold it back": "let it go", 'sword of shan yu': 'sword of shan yu',
    'sword of shan-yu': 'sword of shan yu', 'gramma tala': 'gramma tala',
    "how far i'll go": "how far i'll go", 'how far i ll go': "how far i'll go",
    'right behind you': 'right behind you', 'omnidroid': 'omnidroid',
    'roller bob': 'roller bob', 'bibbidi boppity boo': 'bibbidi bobbidi boo',
    'malicious mean': 'malicious means', 'malicious means': 'malicious means',
    'malicious': 'malicious means', 'a whole new world': 'a whole new world',
    'a-whole-new-world': 'a whole new world', 'kraa': 'kraa the arch-mage',
    'bruno': 'bruno madrigal', 'agatha': 'agatha harkness',
    'kovu': 'kovu', 'kiara': 'kiara', 'be prepared': 'be prepared',
    'be king': 'be king undisputed', 'be king undisputed': 'be king undisputed',
    'desperate plan': 'desperate plan', 'three arrows': 'three arrows',
    'leviathan': 'the leviathan', 'horned king': 'the horned king',
}

def normalize(s: str) -> str:
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9' ]+", ' ', s)
    s = re.sub(r"\s+", ' ', s).strip()
    return s

def kebab_to_name(k: str) -> str:
    return k.replace('-', ' ')

def main():
    names = json.loads(NAMES.read_text())
    full_names = sorted(set(kebab_to_name(n) for n in names['fullnames']), key=lambda s: -len(s))

    SHORT_STOP = {'a', 'an', 'the', 'of', 'in', 'on', 'and', 'or', 'is', 'it', 'i', 'to',
                  'be', 'we', 'you', 'me', 'my', 'this', 'that', 'do', 'go', 'so',
                  'up', 'out', 'no', 'one', 'two', 'three', 'too', 'when',
                  'how', 'what', 'where', 'why', 'who', 'as', 'now', 'time',
                  'right', 'into', 'down', 'home', 'reach', 'take', 'pick',
                  'let', 'mine', 'never', 'tale', 'all', 'oh', 'far',
                  'come'}
    alias_to_canonical = {}
    for fn in full_names:
        alias_to_canonical[fn] = fn
    for fn in full_names:
        toks = fn.split(' ')
        if len(toks) < 3:
            continue
        for n in (3, 4):
            if len(toks) >= n:
                alias = ' '.join(toks[:n])
                if alias in ALIAS_STOPLIST: continue
                if not any(t not in SHORT_STOP for t in toks[:n]): continue
                if len(alias) < 8: continue
                alias_to_canonical.setdefault(alias, fn)
    # Single-token aliases — applied LAST and only if longer alias already missed
    for tok, canon in SINGLE_TOKEN_ALIASES.items():
        alias_to_canonical.setdefault(tok, canon)
    aliases = sorted(alias_to_canonical.keys(), key=lambda s: -len(s))

    recs = [json.loads(l) for l in JSONL.open()]
    by_card = defaultdict(list)
    by_topic = defaultdict(list)
    none_bucket = []
    tagged_out = []
    for r in recs:
        desc_norm = normalize(r['description'])
        matched_canonical = []
        scanned = desc_norm
        for alias in aliases:
            if re.search(r'(?<![a-z])' + re.escape(alias) + r'(?![a-z])', scanned):
                matched_canonical.append(alias_to_canonical[alias])
                scanned = re.sub(r'(?<![a-z])' + re.escape(alias) + r'(?![a-z])',
                                 ' ' * len(alias), scanned)
        mechanics = [tag for kw, tag in MECHANIC_KEYWORDS.items()
                     if re.search(r'\b' + re.escape(kw) + r'\b', desc_norm)]
        ui_hits = [u for u in UI_KEYWORDS if u in desc_norm]
        category = 'other'
        if matched_canonical:
            category = 'card-specific'
        elif ui_hits:
            category = 'ui/infrastructure'
        elif any(q in (r['description'] + ' ').lower() for q in QUESTION_HINT):
            category = 'question-or-comment'
        r2 = dict(r)
        r2['cards'] = sorted(set(matched_canonical))
        r2['mechanics'] = sorted(set(mechanics))
        r2['ui_hits'] = sorted(set(ui_hits))
        r2['category'] = category
        primary = sorted(set(matched_canonical), key=lambda s: -len(s))[0] if matched_canonical else None
        r2['primary_card'] = primary
        tagged_out.append(r2)
        if primary:
            by_card[primary].append(r['id'])
        elif ui_hits:
            by_topic[ui_hits[0]].append(r['id'])
        else:
            none_bucket.append(r['id'])

    with TAGGED.open('w') as f:
        for r in tagged_out:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')

    clusters = {
        'by_card': {k: v for k, v in sorted(by_card.items(), key=lambda kv: -len(kv[1]))},
        'by_topic': {k: v for k, v in sorted(by_topic.items(), key=lambda kv: -len(kv[1]))},
        'unclassified': none_bucket,
    }
    OUT.write_text(json.dumps(clusters, ensure_ascii=False, indent=2))
    print(f'Total reports: {len(recs)}')
    print(f'Card-matched: {sum(len(v) for v in by_card.values())} across {len(by_card)} card clusters')
    print(f'Topic-only: {sum(len(v) for v in by_topic.values())} across {len(by_topic)} topics')
    print(f'Unclassified: {len(none_bucket)}')
    print('\nTop 50 card clusters:')
    for k, v in list(clusters['by_card'].items())[:50]:
        print(f'  {len(v):>3}  {k}')
    print('\nTop 25 topic clusters:')
    for k, v in list(clusters['by_topic'].items())[:25]:
        print(f'  {len(v):>3}  {k}')

if __name__ == '__main__':
    main()
