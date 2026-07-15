#!/usr/bin/env python3
"""Render final triage markdown."""
import json
from collections import Counter, defaultdict
from pathlib import Path
from datetime import datetime

ROOT = Path('/Users/wazar/projects/lorcana-simulator')
CLASSIFIED = ROOT / '.triage/classified.jsonl'
OUT = ROOT / 'bug_reports_triage.md'

STATE_ORDER = [
    ('fixed-in-engine', 'Likely fixed in engine (recent commit ≤ report date)'),
    ('fixed-in-card', 'Likely fixed by card-text update'),
    ('verify-after-fix', 'Reported AFTER a relevant fix shipped — verify resolution'),
    ('covered-by-test', 'No engine bug confirmed; regression test added'),
    ('no-bug-confirmed', 'Investigated, no engine bug reproduced'),
    ('open-card-bug', 'Open: card-specific bug, no known fix yet'),
    ('ui-investigation-needed', 'Open: UI / client surface investigation needed'),
    ('needs-card-identification', 'Open: description references no known card by name'),
    ('question-or-comment', 'User question or rules confusion, no engine action'),
    ('non-bug (comment/suggestion)', 'Praise, feedback, or feature request'),
    ('vague-or-insufficient', 'Insufficient detail to action'),
    ('out-of-engine-scope (network)', 'Network / connection issue (out of engine scope)'),
    ('out-of-engine-scope (replay UI)', 'Replay UI (out of engine scope)'),
    ('out-of-engine-scope (matchmaking)', 'Matchmaking (out of engine scope)'),
    ('out-of-engine-scope (undo UX)', 'Undo UX (out of engine scope)'),
    ('out-of-engine-scope (skip-ability UX)', 'Skip/queue UX (out of engine scope)'),
    ('out-of-engine-scope (client crash)', 'Client crash (out of engine scope)'),
    ('out-of-engine-scope (timer)', 'Turn timer (out of engine scope)'),
    ('out-of-engine-scope (chat UX)', 'Chat / free-text UX (out of engine scope)'),
]

def main():
    recs = [json.loads(l) for l in CLASSIFIED.open()]
    recs.sort(key=lambda r: r['created_at'], reverse=True)
    by_state = defaultdict(list)
    for r in recs:
        by_state[r['state']].append(r)
    counts = Counter(r['state'] for r in recs)

    lines = []
    today = datetime.now().strftime('%Y-%m-%d')
    lines.append(f'# Bug-report triage — {today}')
    lines.append('')
    lines.append(f'Source: `bug_reports.md` ({len(recs)} reports, all with status `open` in DB).')
    lines.append('')
    lines.append('Method: deterministic keyword/cluster matcher applied to each description, cross-')
    lines.append('referenced with recent fix commits and the May-15 daily triage report.')
    lines.append('Classification confidence varies — single-word matches against popular card names')
    lines.append('catch most card references; the `needs-card-identification` bucket holds reports')
    lines.append('whose description names no recognizable card (often vague: "stuck", "error",')
    lines.append('"my opponent did X").')
    lines.append('')
    lines.append('## State summary')
    lines.append('')
    lines.append('| Count | State | Meaning |')
    lines.append('| ---: | --- | --- |')
    for state, label in STATE_ORDER:
        n = counts.get(state, 0)
        if n == 0:
            continue
        lines.append(f'| {n} | `{state}` | {label} |')
    lines.append('')
    lines.append('## Top clusters by primary card')
    lines.append('')
    cluster = Counter()
    for r in recs:
        if r.get('primary_card'):
            cluster[r['primary_card']] += 1
    lines.append('| Reports | Card cluster |')
    lines.append('| ---: | --- |')
    for k, v in cluster.most_common(40):
        lines.append(f'| {v} | {k} |')
    lines.append('')
    lines.append('## Per-report state')
    lines.append('')
    lines.append('Reports are listed grouped by state, newest first. The `cards` column shows the')
    lines.append('matched card cluster (if any); `rationale` summarizes why the state was assigned.')
    lines.append('')
    for state, label in STATE_ORDER:
        rs = by_state.get(state, [])
        if not rs:
            continue
        lines.append(f'### {state} ({len(rs)}) — {label}')
        lines.append('')
        lines.append('| Created | id | Cards | Description | Rationale |')
        lines.append('| --- | --- | --- | --- | --- |')
        for r in rs:
            created = r['created_at'][:16].replace('|', ' ')
            rid = r['id']
            cards = ', '.join(r.get('cards', []) or [])
            cards = cards.replace('|', ' ')
            desc = r['description'].replace('|', '\\|').replace('\n', ' ').strip()
            if len(desc) > 160:
                desc = desc[:157] + '...'
            rationale = (r.get('rationale') or '').replace('|', '\\|')
            lines.append(f'| {created} | `{rid[-10:]}` | {cards} | {desc} | {rationale} |')
        lines.append('')
    OUT.write_text('\n'.join(lines))
    print(f'Wrote {OUT} ({len(lines)} lines)')

if __name__ == '__main__':
    main()
