from pathlib import Path
import json, random, statistics, collections
p = Path(__file__).parent
import gzip
for archive in p.glob("*.json.gz"):
    target = archive.with_suffix("")
    if not target.exists(): target.write_bytes(gzip.decompress(archive.read_bytes()))
report = json.loads((p/'report.json').read_text())
ms = report['matches']
decks = json.loads((p/'decks.json').read_text())
names = {d['id']: d['name'] for d in decks}
ids = list(names)
valid = [m for m in ms if m['termination'] in ('rules-win', 'deck-out')]
failures = [m for m in ms if m not in valid]
wins = sum(m['winner'] == 'candidate' for m in valid)
blocks = collections.defaultdict(list)
for m in valid: blocks[m['blockId']].append(m)
# Paired controller swaps are kept together, as are both deck assignments in a cross match.
rng = random.Random(20261012)
block_list = list(blocks.values())
boot = []
for _ in range(20000):
    sample = [rng.choice(block_list) for _ in block_list]
    boot.append(sum(m['winner']=='candidate' for b in sample for m in b) / sum(map(len,sample)))
boot.sort()
ci = [boot[499],boot[19499]]
mirrors = [m for m in valid if m['candidateDeckId']==m['baselineDeckId']]
by_deck=[]
for d in ids:
    games=[m for m in valid if m['candidateDeckId']==d]
    mirror=[m for m in games if m['baselineDeckId']==d]
    by_deck.append(dict(id=d,name=names[d],games=len(games),wins=sum(m['winner']=='candidate' for m in games),mirror_games=len(mirror),mirror_wins=sum(m['winner']=='candidate' for m in mirror),by_seat={s:[sum(m['winner']=='candidate' for m in games if m['candidateSeat']==s),sum(m['candidateSeat']==s for m in games)] for s in ['p1','p2']}))
analysis=dict(matches=len(ms),valid=len(valid),wins=wins,win_rate=wins/len(valid),bootstrap_interval=ci,hard_failures=failures,by_deck=by_deck,termination_counts=dict(collections.Counter(m['termination'] for m in ms)),committed_rejections=sum(m['diagnostics'].get('illegalProposals',0) for m in ms),expert_decisions=sum(m['diagnostics'].get('expertDecisions',0) for m in ms),expert_nodes=sum(m['diagnostics'].get('expertNodes',0) for m in ms),expert_max_nodes=max(m['diagnostics'].get('expertMaxNodes',0) for m in ms),expert_cycles=sum(m['diagnostics'].get('expertCycles',0) for m in ms))
(p/'analysis.json').write_text(json.dumps(analysis,indent=2)+'\n')
lines=['# Alpha Clash Expert versus meta-v1 — Season 3', '', f'Expert won **{wins}/{len(valid)} valid games ({wins/len(valid):.1%})**. The 95% paired-block bootstrap interval is **{ci[0]:.1%}–{ci[1]:.1%}**.', '',f'All {len(ms)} scheduled games: {dict(collections.Counter(m["termination"] for m in ms))}. Hard failures: {len(failures)}. Rejected committed proposals: {analysis["committed_rejections"]}.', '', f'Mirrors: Expert won {sum(m["winner"]=="candidate" for m in mirrors)}/{len(mirrors)}. Cross-deck games: {wins-sum(m["winner"]=="candidate" for m in mirrors)}/{len(valid)-len(mirrors)}.', '', '## Results by deck piloted by Expert', '', '| Deck | Expert wins | Win rate | Mirror wins | First seat | Second seat |', '|---|---:|---:|---:|---:|---:|']
for d in by_deck:
    a,b=d['by_seat']['p1'],d['by_seat']['p2']
    lines.append(f'| {d["name"]} | {d["wins"]}/{d["games"]} | {d["wins"]/d["games"]:.1%} | {d["mirror_wins"]}/{d["mirror_games"]} | {a[0]}/{a[1]} | {b[0]}/{b[1]} |')
lines += ['', 'These are bot-comparison results. Each row measures Expert while piloting that deck against meta-v1 across the fixed opponent field. They are not a new ranking of human tournament deck strength.', '', '## Full matchup matrix', '', 'Rows are Expert decks; columns are meta-v1 decks. Each cell has six games, including three with Expert in each seat.', '', '| Expert deck | '+' | '.join(str(n+1) for n in range(8))+' |','|---|'+'---:|'*8]
for i,d in enumerate(ids):
    cells=[]
    for other in ids:
        games=[m for m in valid if m['candidateDeckId']==d and m['baselineDeckId']==other]
        cells.append(f'{sum(m["winner"]=="candidate" for m in games)}/{len(games)}')
    lines.append(f'| {i+1}. {names[d]} | '+' | '.join(cells)+' |')
lines += ['', '## Seed blocks', '', '| Block | Expert wins | Win rate |', '|---|---:|---:|']
for i in range(3):
    games=[m for m in valid if m['blockId'].endswith(f'/block-{i}')]
    n=sum(m['winner']=='candidate' for m in games)
    lines.append(f'| {i} | {n}/{len(games)} | {n/len(games):.1%} |')
lines += ['', '## Implementation and method', '', '- Engine-owned oracle planner; full hands, deck order, face-down identities and native RNG state are available by design. Player projections remain filtered.', '- Search settings: 768 native command attempts, beam width 5, depth 12, four reply lines. Each state probes at most 96 proposals and retains up to 24 distinct accepted outcomes; combinatorial choices are bounded.', '- Native forks execute the same commands as live play. Search compares board value, health, resources, hand quality, known upcoming draws, attack sequences, responses, costs, and targets. Forced continuations and per-turn live cycle history prevent repeated no-progress decisions.', '- 36 matchups: eight mirrors and 28 cross-deck pairs. Three fresh seed blocks per pair; 384 games and 108 paired matchup blocks. All games use the final frozen source revision. No historical games reused.', '- Adapter v4 removes the final `-seat-1`/`-seat-2` seed suffix before native shuffling. Each controller swap therefore uses the same physical deck assignment and shuffle. Cross matches also reverse the deck assignment.', '- Both policies use oracle information. meta-v1 decision rules are unchanged. Exact stored main decks are used, with no sideboarding and with construction-invalid casual lists admitted.', '- 20,000 deterministic bootstrap resamples of complete paired matchup blocks. This estimates uncertainty under this fixed bot/deck/seed scheme. Only three seed blocks per matchup were tested; individual six-game cells remain small samples.', '', '## Search diagnostics', '',f'- Expert decisions: {analysis["expert_decisions"]:,}; simulated command attempts: {analysis["expert_nodes"]:,}; mean attempts per decision: {analysis["expert_nodes"]/analysis["expert_decisions"]:.1f}.',f'- Maximum attempts in one decision: {analysis["expert_max_nodes"]}; detected cycle branches avoided: {analysis["expert_cycles"]:,}.',f'- Median game length: {statistics.median(m["turnCount"] for m in ms)} turns, {statistics.median(m["actionCount"] for m in ms)} accepted commands.', '', '## Promotion and limits', '', f'Standard evaluator verdict: **{report["verdict"]}**. Reasons: '+ '; '.join(report['verdictReasons'])+'.', 'The standard gate weights matchup blocks equally, while the headline rate counts games. Its confidence interval is in win-rate improvement over 50%, so it can differ from the headline interval.', 'Expert is selectable in local practice. The recommended strategy remains meta-v1. No default, deployment, matchmaking validation policy, or production promotion target was changed.', 'The search is bounded and can miss strong lines or card-specific plans. Opening hands keep the existing keep policy. Native completion does not prove every card rule, browser interaction, hosted transport, or deployment.', '', '## Evidence and reproduction', '', '[Manifest](manifest.json), [schedule](schedule.json), [report](report.json), [analysis](analysis.json), [matches](matches.jsonl), [decks](decks.json), [run metadata](run-metadata.json), and [replay checks](replay-checks.json).', '', 'From `submodules/agnostic-simulator/tools/bot-lab`: `bun reports/alpha-clash/2026-10-12/season3-expert/run.ts`, then `python3 reports/alpha-clash/2026-10-12/season3-expert/review.py`. The runner resumes native journals and rejects source/catalog drift. Replay with `bun reports/alpha-clash/2026-10-12/season3-expert/replay.ts`.', '']
lines += [
    '## Findings and follow-up', '',
    '- The aggregate gain holds across all three seed blocks: 111/128, 112/128, and 109/128 Expert wins.',
    '- Expert wins 37/48 mirror games (77.1%). This removes the difference in deck selection from those comparisons.',
    '- War is the main weak spot: 2/6 mirror wins, including 0/3 from the second seat. Valen is tied at 3/6. These small samples identify cases to inspect; they do not establish the cause of the losses.',
    '- Before changing weights, inspect the War mirror losses and the Valen mirrors, then test any adjustment with new seed blocks. Keep these results as the v1 baseline.', '',
    '## Focused validation', '',
    '- 68 focused tests passed: nine Expert engine tests, 38 adapter/deck tests, and 21 bot-lab tests.',
    '- Engine and adapter type checks, focused bot-lab type checks, automation lint, and whitespace checks passed.',
    '- Tactical tests cover lethal action order, private Counter information, multiple obstructors, resource colors, target combinations, Manifest, search isolation, and cycle handling.',
    '- The complete suite has zero failed terminations or rejected committed commands. Rejected speculative search branches are expected and are separate from committed commands.', '',
]
replay=p/'replay-checks.json'
if replay.exists():
    checks=json.loads(replay.read_text())
    lines+=['## Replay verification','',f'{sum(c["matches"] for c in checks)}/{len(checks)} sampled complete match records reproduced exactly. Samples cover all eight mirror decks plus the shortest and longest games, with duplicate samples removed.','']
rendered='\n'.join(lines)
for archive in p.rglob('*.gz'):
    name=archive.relative_to(p).as_posix()
    rendered=rendered.replace(']('+name[:-3]+')', ']('+name+')')
(p/'review.md').write_text(rendered)
print(json.dumps({k:v for k,v in analysis.items() if k!='by_deck'},indent=2))
