#!/usr/bin/env python3
"""Generate a worksheet for every pending bug report so a human can fill in blanks."""
import json
import re
from collections import defaultdict, Counter
from pathlib import Path
from datetime import datetime

ROOT = Path('/Users/wazar/projects/lorcana-simulator')
CLASSIFIED = ROOT / '.triage/classified.jsonl'
OUT = ROOT / 'bug_reports_pending.md'

PENDING = {
    'open-card-bug', 'ui-investigation-needed', 'needs-card-identification',
    'vague-or-insufficient', 'question-or-comment', 'verify-after-fix',
}
OOS_PREFIX = 'out-of-engine-scope'


def shorten(s: str, n: int = 140) -> str:
    s = s.replace('\n', ' ').strip()
    return s if len(s) <= n else s[:n - 3] + '...'


def safe(s: str) -> str:
    return s.replace('|', '\\|')


def cluster_key(r):
    if r.get('primary_card'):
        return ('card', r['primary_card'])
    if r['state'] == 'ui-investigation-needed' and r.get('ui_hits'):
        return ('ui', r['ui_hits'][0])
    return None  # singleton


def member_row(r):
    gid = ''
    turn = ''
    plat = ''
    ctx = r.get('context') or {}
    if isinstance(ctx, dict):
        gid = ctx.get('gameId') or ''
        turn = str(ctx.get('turn') or '')
        plat = ctx.get('platform') or ''
    return (
        f"| {r['created_at'][:16]} | `{r['id'][-10:]}` | "
        f"{safe(gid)} | {turn} | {plat} | {safe(shorten(r['description']))} |"
    )


CHECKBOX_BLOCK = """\
**Action required (check one or more):**
- [ ] Reproduced — engine bug confirmed → fix in: `_______________`
- [ ] Not reproducible — closing as `non-reproducible`. Reason: `_______________`
- [ ] Working as intended (cite rule): `_______________`
- [ ] Already fixed by commit/PR: `_______________`
- [ ] Duplicate of cluster `_______________`
- [ ] Belongs outside the engine package (UI / network / matchmaking)
- [ ] User error / rules confusion → respond to user

**Engineer notes:** `_______________`

**Resolution / final status:** `_______________`
"""


def main():
    recs = [json.loads(l) for l in CLASSIFIED.open()]
    recs.sort(key=lambda r: r['created_at'], reverse=True)
    pending = [r for r in recs if r['state'] in PENDING]
    oos = [r for r in recs if r['state'].startswith(OOS_PREFIX)]
    closed = [r for r in recs if r['state'] not in PENDING and not r['state'].startswith(OOS_PREFIX)]

    # Group pending into clusters
    clustered = defaultdict(list)
    singletons = []
    for r in pending:
        k = cluster_key(r)
        if k is None:
            singletons.append(r)
        else:
            clustered[k].append(r)

    today = datetime.now().strftime('%Y-%m-%d')
    out = []
    out.append(f'# Pending bug reports — worksheet ({today})')
    out.append('')
    out.append(f'Source: `bug_reports.md` (1551 reports). Companion: `bug_reports_triage.md`.')
    out.append('')
    out.append(f'**Pending (this file): {len(pending)} reports across '
               f'{len(clustered)} clusters + {len(singletons)} singletons.**  ')
    out.append(f'Closed (auto-classified): {len(closed)}.  ')
    out.append(f'Out-of-engine-scope (separate section): {len(oos)}.')
    out.append('')
    out.append('## How to use')
    out.append('')
    out.append('1. Pick a cluster or singleton.')
    out.append('2. Pull the listed replay (`gameId` + `turn`) and confirm whether the bug reproduces.')
    out.append('3. Tick the action box, fill the blanks, and (if a fix is needed) hand off to an')
    out.append('   implementation agent — point it at the cluster anchor (`#cluster-<slug>`).')
    out.append('4. Once every member of a cluster has a tick, the cluster is done; if some members')
    out.append('   diverge (e.g. one is duplicate, one is reproducible), split them by adding')
    out.append('   per-member notes below the table.')
    out.append('5. Mark singletons individually. Reports that cannot be reproduced after honest')
    out.append('   effort should be ticked `Not reproducible` with a reason; that is a valid')
    out.append('   resolution per the goal.')
    out.append('')
    out.append('## Legend')
    out.append('')
    out.append('- `gameId` (column) — replay id; feed to the replay CLI to inspect the turn.')
    out.append('- `turn` — turn number reported by the client at submit time.')
    out.append('- `platform` — desktop / mobile when the report was filed.')
    out.append('- A cluster anchor is `#cluster-<slug>`; reference it in fixes / PRs to close all members.')
    out.append('')

    # Card clusters first (highest impact)
    card_clusters = [(k, v) for k, v in clustered.items() if k[0] == 'card']
    card_clusters.sort(key=lambda kv: -len(kv[1]))
    ui_clusters = [(k, v) for k, v in clustered.items() if k[0] == 'ui']
    ui_clusters.sort(key=lambda kv: -len(kv[1]))

    out.append('---')
    out.append('')
    out.append(f'## Card clusters ({len(card_clusters)})')
    out.append('')
    out.append('Each cluster contains every pending report whose description matched the same')
    out.append('card. Resolve the cluster once; apply the decision to all members.')
    out.append('')
    for (_, name), members in card_clusters:
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        out.append(f'### cluster-{slug} — {name} ({len(members)} reports) <a id="cluster-{slug}"></a>')
        out.append('')
        # show top 3 representative descriptions
        out.append('Representative descriptions:')
        for r in members[:5]:
            out.append(f'- _{shorten(r["description"], 220)}_')
        out.append('')
        out.append('Members:')
        out.append('')
        out.append('| Created | id | gameId | turn | platform | description |')
        out.append('| --- | --- | --- | ---: | --- | --- |')
        for r in members:
            out.append(member_row(r))
        out.append('')
        out.append(CHECKBOX_BLOCK)
        out.append('')

    out.append('---')
    out.append('')
    out.append(f'## UI / surface clusters ({len(ui_clusters)})')
    out.append('')
    out.append('Grouped by the strongest UI keyword in the description (the matcher is loose;')
    out.append('individual reports may belong elsewhere).')
    out.append('')
    for (_, name), members in ui_clusters:
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        out.append(f'### ui-{slug} — "{name}" ({len(members)} reports) <a id="ui-{slug}"></a>')
        out.append('')
        out.append('| Created | id | gameId | turn | platform | description |')
        out.append('| --- | --- | --- | ---: | --- | --- |')
        for r in members:
            out.append(member_row(r))
        out.append('')
        out.append(CHECKBOX_BLOCK)
        out.append('')

    # Singletons — one row each
    out.append('---')
    out.append('')
    out.append(f'## Singletons ({len(singletons)})')
    out.append('')
    out.append('Reports without an automatic card cluster. Pre-grouped by state. For each one,')
    out.append('record either the matched card (so the next pass can cluster it) or tick')
    out.append('`Not reproducible`.')
    out.append('')

    by_state = defaultdict(list)
    for r in singletons:
        by_state[r['state']].append(r)
    for state in ['verify-after-fix', 'question-or-comment',
                  'needs-card-identification', 'vague-or-insufficient']:
        rs = by_state.get(state, [])
        if not rs:
            continue
        out.append(f'### singletons / {state} ({len(rs)})')
        out.append('')
        out.append('| Created | id | gameId | turn | description | Card? | Decision | Notes |')
        out.append('| --- | --- | --- | ---: | --- | --- | --- | --- |')
        for r in rs:
            gid = ''
            turn = ''
            ctx = r.get('context') or {}
            if isinstance(ctx, dict):
                gid = ctx.get('gameId') or ''
                turn = str(ctx.get('turn') or '')
            desc = safe(shorten(r['description']))
            out.append(
                f"| {r['created_at'][:16]} | `{r['id'][-10:]}` | {safe(gid)} | {turn} | "
                f"{desc} | _____ | _____ | _____ |"
            )
        out.append('')

    # Out of engine scope — listed read-only
    out.append('---')
    out.append('')
    out.append(f'## Out-of-engine-scope ({len(oos)})')
    out.append('')
    out.append('These are auto-classified as out-of-scope for the card-rules engine. They still')
    out.append('need a human owner (network / matchmaking / UI / replay UI / undo / chat / timer /')
    out.append('client-crash). Confirm the routing; reports listed here will not be reopened as')
    out.append('engine bugs unless re-classified.')
    out.append('')
    oos_by_state = defaultdict(list)
    for r in oos:
        oos_by_state[r['state']].append(r)
    for state, rs in sorted(oos_by_state.items(), key=lambda kv: -len(kv[1])):
        out.append(f'### {state} ({len(rs)})')
        out.append('')
        out.append('| Created | id | gameId | description | Confirm route | Notes |')
        out.append('| --- | --- | --- | --- | --- | --- |')
        for r in rs:
            gid = ''
            ctx = r.get('context') or {}
            if isinstance(ctx, dict):
                gid = ctx.get('gameId') or ''
            desc = safe(shorten(r['description']))
            out.append(
                f"| {r['created_at'][:16]} | `{r['id'][-10:]}` | {safe(gid)} | {desc} | _____ | _____ |"
            )
        out.append('')

    out.append('---')
    out.append('')
    out.append('## Done? ')
    out.append('')
    out.append('Every entry above should end with a ticked decision box (or a filled-in')
    out.append('singleton row). When all are ticked:')
    out.append('')
    out.append('- Re-run `python3 .triage/classify.py` after adding any new fix commits.')
    out.append('- Update the resolution status in the prod DB (set `status` to `resolved` and')
    out.append('  populate `resolution_note`).')
    out.append('- Re-render `bug_reports_triage.md` with `python3 .triage/render.py` if you want')
    out.append('  the read-only summary refreshed.')
    out.append('')

    OUT.write_text('\n'.join(out))
    print(f'Wrote {OUT}: {len(out)} lines / {len(pending)} pending across {len(clustered)} clusters + {len(singletons)} singletons')


if __name__ == '__main__':
    main()
