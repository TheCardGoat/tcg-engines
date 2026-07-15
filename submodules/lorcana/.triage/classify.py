#!/usr/bin/env python3
"""Assign engineering 'state' to each report based on known fixes and clustering."""
import json
import re
from datetime import datetime
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path('/Users/wazar/projects/lorcana-simulator')
TAGGED = ROOT / '.triage/tagged.jsonl'
STATES = ROOT / '.triage/classified.jsonl'
SUMMARY = ROOT / '.triage/state_summary.json'

# Known fix scopes: (regex matchers in description) -> (status, fix_commit, fix_date_iso)
FIXES = [
    {
        'name': 'move-damage-resolver',
        'pattern': re.compile(r'\b(luisa|mother gothel|violet parr|demona|cheshire(?: cat)?)\b', re.I),
        'extra_keywords': ['move damage', 'damage move', 'move dmg', 'move the damage',
                           'transfer damage', 'put damage'],
        'commit': '41f772a6 / 8aa2c91a',
        'date': '2026-05-15',
        'status': 'fixed-in-engine',
        'note': 'Move-damage slot-aware resolver + target-analysis fix (May 15).',
    },
    {
        'name': 'sacrifice-banish-trigger',
        'pattern': re.compile(r'\b(belle apprentice|ingenious device|bomb|sacrifice|sacrificed)\b', re.I),
        'extra_keywords': ['exploding', 'explode', 'banish trigger'],
        'commit': '8aa2c91a',
        'date': '2026-05-15',
        'status': 'fixed-in-engine',
        'note': 'Sacrificed items now banish via banishAsAbilityCost so on-banish triggers fire.',
    },
    {
        'name': 'shift-availability',
        'pattern': re.compile(r"\b(diablo|madam mim|cant shift|can't shift|won't shift|wont shift|unable to shift)\b", re.I),
        'extra_keywords': ['shift'],
        'commit': '8aa2c91a',
        'date': '2026-05-15',
        'status': 'fixed-in-engine',
        'note': 'getAvailableMoves now lists shift-only cards in shiftCard bucket.',
    },
    {
        'name': 'promising-lead',
        'pattern': re.compile(r'\b(promising lead)\b', re.I),
        'extra_keywords': [],
        'commit': '8aa2c91a',
        'date': '2026-05-15',
        'status': 'fixed-in-card',
        'note': 'Promising Lead now grants +1 lore and Support to chosen character.',
    },
    {
        'name': 'mickey-entry-mode',
        'pattern': re.compile(r'\b(mickey)\b.*(entry|play mode|alternate cost|play for)', re.I),
        'extra_keywords': [],
        'commit': '38b8f066',
        'date': '2026-05-13',
        'status': 'fixed-in-engine',
        'note': 'Mickey entry-mode choice fixed May 13.',
    },
    {
        'name': 'chernabog-opponent-chooser',
        'pattern': re.compile(r'\b(chernabog)\b', re.I),
        'extra_keywords': [],
        'commit': '#84',
        'date': '2026-05-12',
        'status': 'fixed-in-engine',
        'note': 'Chernabog opponent chooser fixed May 12.',
    },
    {
        'name': 'forfeit-phase-guard',
        'pattern': re.compile(r'\b(forfeit|surrender|give up)\b', re.I),
        'extra_keywords': [],
        'commit': '2cc1c0b0',
        'date': '2026-05-14',
        'status': 'fixed-in-engine',
        'note': 'forfeitGame allowed in every phase (May 14).',
    },
    {
        'name': 'match-history-keys',
        'pattern': re.compile(r'\b(match history|history list|duplicate match)\b', re.I),
        'extra_keywords': [],
        'commit': '2df771ee',
        'date': '2026-05-14',
        'status': 'fixed-in-ui',
        'note': 'Match history duplicate keys fixed May 14.',
    },
    {
        'name': 'hand-in-the-box',
        'pattern': re.compile(r'\b(hand[\s-]in[\s-]a[\s-]box|hand[\s-]in[\s-]the[\s-]box)\b', re.I),
        'extra_keywords': [],
        'commit': '8de26420',
        'date': '2026-05-15',
        'status': 'covered-by-test',
        'note': 'Hand-in-the-Box visual fixture added May 15; no engine bug confirmed.',
    },
    {
        'name': 'rapunzel-ready-for-adventure',
        'pattern': re.compile(r'\brapunzel\b.*\b(ready|adventure)\b', re.I),
        'extra_keywords': [],
        'commit': '8301b043',
        'date': '2026-05-15',
        'status': 'covered-by-test',
        'note': 'Regression test added May 15.',
    },
    {
        'name': 'snowboard-ace-trigger',
        'pattern': re.compile(r'\bmickey mouse\b.*\bsnowboard\b|\bsnowboard ace\b|\bsnow fort\b', re.I),
        'extra_keywords': [],
        'commit': '8301b043',
        'date': '2026-05-15',
        'status': 'no-bug-confirmed',
        'note': 'Investigated and added regression coverage; no engine bug.',
    },
]

OUT_OF_SCOPE_PATTERNS = [
    (re.compile(r"\b(disconnect|reconnect|got kicked|logged out|connection)\b", re.I),
     'out-of-engine-scope (network)'),
    (re.compile(r"\b(save replay|download replay|replay button|export replay)\b", re.I),
     'out-of-engine-scope (replay UI)'),
    (re.compile(r"\b(matchmaking|queue|lobby)\b", re.I),
     'out-of-engine-scope (matchmaking)'),
    (re.compile(r"\b(undo|undid|redo)\b", re.I),
     'out-of-engine-scope (undo UX)'),
    (re.compile(r"\b(skip|skipping) (this )?(ability|trigger|effect|prompt)\b", re.I),
     'out-of-engine-scope (skip-ability UX)'),
    (re.compile(r"\b(crash|crashed|freeze|froze|frozen|loading screen|stuck on loading|black screen)\b", re.I),
     'out-of-engine-scope (client crash)'),
    (re.compile(r"\b(timer|turn timer|time ran out|time out)\b", re.I),
     'out-of-engine-scope (timer)'),
    (re.compile(r"\b(free (text|chat)|chat doesn't|chat does not|emote|emoji|chat message)\b", re.I),
     'out-of-engine-scope (chat UX)'),
]

VAGUE_PATTERNS = [
    re.compile(r'^\s*error\W*$', re.I),
    re.compile(r'^\s*bug\W*$', re.I),
    re.compile(r'^\s*\?\s*$'),
    re.compile(r'^\s*test\W*$', re.I),
    re.compile(r'^\s*\.{1,5}\s*$'),
]

COMMENT_PATTERNS = [
    re.compile(r'\bthank(s| you)\b', re.I),
    re.compile(r'\b(works|working) now\b', re.I),
    re.compile(r'\b(love|like) (the|this) (app|game|sim)', re.I),
    re.compile(r'\b(suggestion|feature request|please add)\b', re.I),
]


def classify(rec):
    desc = rec['description']
    norm = desc.lower()
    # Vague
    for p in VAGUE_PATTERNS:
        if p.search(desc.strip()):
            return {'state': 'vague-or-insufficient', 'rationale': 'description has no actionable detail'}
    # Comment / praise / suggestion
    for p in COMMENT_PATTERNS:
        if p.search(desc):
            return {'state': 'non-bug (comment/suggestion)', 'rationale': 'positive/feedback message or feature request'}
    # Out of scope (network, UI, undo, etc.) - check first because some say "stuck" and aren't engine bugs
    for pattern, label in OUT_OF_SCOPE_PATTERNS:
        if pattern.search(norm):
            return {'state': label, 'rationale': 'matches non-engine surface'}
    # Known fixes
    matches = []
    for fix in FIXES:
        if fix['pattern'].search(norm):
            matches.append(fix)
        else:
            for k in fix['extra_keywords']:
                if k in norm:
                    matches.append(fix)
                    break
    if matches:
        # If the report was created before the fix date, it's likely already fixed
        created = rec['created_at'][:10]
        m = matches[0]
        return {
            'state': m['status'] if created <= m['date'] else 'verify-after-fix',
            'rationale': f"matches '{m['name']}': {m['note']}",
            'fix_commit': m['commit'],
            'fix_date': m['date'],
        }
    # Card-specific (cluster but no known fix)
    if rec['cards']:
        return {
            'state': 'open-card-bug',
            'rationale': f"references {', '.join(rec['cards'][:3])}; not covered by recent triage fixes",
        }
    # UI hits without specific scope
    if rec['ui_hits']:
        return {
            'state': 'ui-investigation-needed',
            'rationale': f"UI keywords {rec['ui_hits'][:3]}",
        }
    # Question
    if rec['category'] == 'question-or-comment':
        return {'state': 'question-or-comment', 'rationale': 'looks like a question or rules confusion'}
    # Fallback
    return {'state': 'needs-card-identification', 'rationale': 'no card or UI keyword detected'}


def main():
    recs = [json.loads(l) for l in TAGGED.open()]
    out = []
    states = Counter()
    for r in recs:
        c = classify(r)
        r2 = dict(r)
        r2.update(c)
        out.append(r2)
        states[c['state']] += 1
    with STATES.open('w') as f:
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
    # Group by state -> cluster -> ids
    grouped = defaultdict(lambda: defaultdict(list))
    for r in out:
        cluster = r.get('primary_card') or (r.get('ui_hits') or ['none'])[0]
        grouped[r['state']][cluster].append(r['id'])
    SUMMARY.write_text(json.dumps({
        'state_counts': dict(states),
        'grouped': {s: {k: v for k, v in sorted(g.items(), key=lambda kv: -len(kv[1]))} for s, g in grouped.items()},
    }, ensure_ascii=False, indent=2))
    print('Total:', len(out))
    print('\nState distribution:')
    for s, n in sorted(states.items(), key=lambda kv: -kv[1]):
        print(f'  {n:>4}  {s}')


if __name__ == '__main__':
    main()
