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
lines=['# Alpha Clash Expert v2 versus meta-v1 — Season 3', '', f'Expert won **{wins}/{len(valid)} valid games ({wins/len(valid):.1%})**. The 95% paired-block bootstrap interval is **{ci[0]:.1%}–{ci[1]:.1%}**.', '',f'All {len(ms)} scheduled games: {dict(collections.Counter(m["termination"] for m in ms))}. Hard failures: {len(failures)}. Rejected committed proposals: {analysis["committed_rejections"]}.', '', f'Mirrors: Expert won {sum(m["winner"]=="candidate" for m in mirrors)}/{len(mirrors)}. Cross-deck games: {wins-sum(m["winner"]=="candidate" for m in mirrors)}/{len(valid)-len(mirrors)}.', '', '## Results by deck piloted by Expert', '', '| Deck | Expert wins | Win rate | Mirror wins | First seat | Second seat |', '|---|---:|---:|---:|---:|---:|']
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
lines += ['', '## Implementation and method', '', '- Engine-owned oracle planner; full hands, deck order, face-down identities and native RNG state are available by design. Player projections remain filtered.', '- Search settings: 768 native command attempts, beam width 5, depth 12, four reply lines. Each state probes at most 96 proposals and retains up to 24 distinct accepted outcomes; combinatorial choices are bounded.', '- Version 2 filters impossible timing/source-zone proposals, resumes partial probe caches, distributes candidates across attackers, resolves next-turn effects, and values early resources. See [loss investigation](investigation/review.md).', '- Native forks execute the same commands as live play. Search compares board value, health, resources, hand quality, known upcoming draws, attack sequences, responses, costs, and targets. Forced continuations and per-turn live cycle history prevent repeated no-progress decisions.', '- Fresh seed base: `alpha-clash-expert-v2-season3-holdout`.', '- 36 matchups: eight mirrors and 28 cross-deck pairs. Three fresh seed blocks per pair; 384 games and 108 paired matchup blocks. All games use the final frozen source revision. No historical games reused.', '- Adapter v4 removes the final `-seat-1`/`-seat-2` seed suffix before native shuffling. Each controller swap therefore uses the same physical deck assignment and shuffle. Cross matches also reverse the deck assignment.', '- Both policies use oracle information. meta-v1 decision rules are unchanged. Exact stored main decks are used, with no sideboarding and with construction-invalid casual lists admitted.', '- 20,000 deterministic bootstrap resamples of complete paired matchup blocks. This estimates uncertainty under this fixed bot/deck/seed scheme. Only three seed blocks per matchup were tested; individual six-game cells remain small samples.', '', '## Search diagnostics', '',f'- Expert decisions: {analysis["expert_decisions"]:,}; simulated command attempts: {analysis["expert_nodes"]:,}; mean attempts per decision: {analysis["expert_nodes"]/analysis["expert_decisions"]:.1f}.',f'- Maximum attempts in one decision: {analysis["expert_max_nodes"]}; detected cycle branches avoided: {analysis["expert_cycles"]:,}.',f'- Median game length: {statistics.median(m["turnCount"] for m in ms)} turns, {statistics.median(m["actionCount"] for m in ms)} accepted commands.', '', '## Promotion and limits', '', f'Standard evaluator verdict: **{report["verdict"]}**. Reasons: '+ '; '.join(report['verdictReasons'])+'.', 'The standard gate weights matchup blocks equally, while the headline rate counts games. Its confidence interval is in win-rate improvement over 50%, so it can differ from the headline interval.', 'Expert is selectable in local practice. The recommended strategy remains meta-v1. No default, deployment, matchmaking validation policy, or production promotion target was changed.', 'The search is bounded and can miss strong lines or card-specific plans. Opening hands keep the existing keep policy. Native completion does not prove every card rule, browser interaction, hosted transport, or deployment.', '', '## Evidence and reproduction', '', '[Manifest](manifest.json), [schedule](schedule.json), [report](report.json), [analysis](analysis.json), [matches](matches.jsonl), [decks](decks.json), [run metadata](run-metadata.json), and [replay checks](replay-checks.json).', '', 'From `submodules/agnostic-simulator/tools/bot-lab`: `bun reports/alpha-clash/2026-10-12/season3-expert-v2/run.ts`, then `python3 reports/alpha-clash/2026-10-12/season3-expert-v2/review.py`. The runner resumes native journals and rejects source/catalog drift. Replay with `bun reports/alpha-clash/2026-10-12/season3-expert-v2/replay.ts`.', '']
controls=p/'controls-v1.json'
if controls.exists():
    control=json.loads(controls.read_text())
    old={f"{m['blockId']}/{m['legId']}":m for m in control['matches']}
    pairs=[(old[f"{m['blockId']}/{m['legId']}"],m) for m in mirrors]
    assert len(pairs)==48
    assert all(a['seed']==b['seed'] and a['candidateSeat']==b['candidateSeat'] and a['candidateDeckId']==b['candidateDeckId'] for a,b in pairs)
    control_failures=[a for a,b in pairs if a['termination'] not in ('rules-win','deck-out')]
    assert not control_failures
    gained=sum(a['winner']!='candidate' and b['winner']=='candidate' for a,b in pairs)
    lost=sum(a['winner']=='candidate' and b['winner']!='candidate' for a,b in pairs)
    old_wins=sum(a['winner']=='candidate' for a,b in pairs)
    new_wins=sum(b['winner']=='candidate' for a,b in pairs)
    paired=collections.defaultdict(list)
    for a,b in pairs: paired[a['blockId']].append((b['winner']=='candidate')-(a['winner']=='candidate'))
    groups=list(paired.values());control_rng=random.Random(20261013)
    deltas=sorted(sum(sum(control_rng.choice(groups)) for _ in groups)/48 for _ in range(20000))
    comparison=dict(v1_wins=old_wins,v2_wins=new_wins,games=48,gained=gained,lost=lost,paired_bootstrap_delta_interval=[deltas[499],deltas[19499]])
    analysis['fresh_mirror_control']=comparison
    (p/'analysis.json').write_text(json.dumps(analysis,indent=2)+'\n')
    lines+=['## Archived v1 controls on the same fresh mirrors','',f'v1 won **{old_wins}/48**; v2 won **{new_wins}/48**. v2 changed {gained} losses to wins and {lost} wins to losses. The paired-block bootstrap interval for the win-rate difference is {deltas[499]:+.1%} to {deltas[19499]:+.1%}.','', '| Deck | Archived v1 | Expert v2 |', '|---|---:|---:|']
    for d in ids:
        samples=[(a,b) for a,b in pairs if b['candidateDeckId']==d]
        lines.append(f'| {names[d]} | {sum(a["winner"]=="candidate" for a,b in samples)}/{len(samples)} | {sum(b["winner"]=="candidate" for a,b in samples)}/{len(samples)} |')
    lines+=['', 'The aggregate mirror interval includes zero, so this sample does not establish a clear overall mirror improvement.', '', 'These controls compare the two planners against meta-v1 with identical decks, shuffle seeds, and seats. Each individual deck still has only six mirror games. The old 332/384 headline used different seeds and is historical context, not a matched estimate of improvement.', '', '[Control records](controls-v1.json), [War archived-policy replay proof](controls-v1-proof-0.json), and [Valen archived-policy replay proof](controls-v1-proof-1.json).', '']
confirmation=p/'confirm-report.json'
if confirmation.exists():
    extra=json.loads(confirmation.read_text())
    grouped=collections.defaultdict(dict)
    for entry in extra['results']:
        m=entry['record']
        assert m['termination'] in ('rules-win','deck-out')
        grouped[f"{m['blockId']}/{m['legId']}"][entry['version']]=m
    assert len(grouped)==40 and all(set(v)=={1,2} for v in grouped.values())
    assert all(v[1]['seed']==v[2]['seed'] and v[1]['candidateSeat']==v[2]['candidateSeat'] for v in grouped.values())
    extra_summary=[]
    lines+=['## Additional fresh War and Valen mirrors','', 'The first fresh War sample was 4/6 for v2 versus 5/6 for v1. This prompted a fixed additional check of ten new seed blocks for each named deck, with no code or weight changes. The 80 supplemental games are separate from the original 384-game suite and its promotion gate.', '', '| Deck | Archived v1 | Expert v2 | Losses turned into wins | Wins turned into losses |', '|---|---:|---:|---:|---:|']
    for deck in ['season3-xiii-war','season3-sloppy-valen']:
        pairs=[(v[1],v[2]) for v in grouped.values() if v[1]['candidateDeckId']==deck]
        assert len(pairs)==20
        old_wins=sum(a['winner']=='candidate' for a,b in pairs)
        new_wins=sum(b['winner']=='candidate' for a,b in pairs)
        gained=sum(a['winner']!='candidate' and b['winner']=='candidate' for a,b in pairs)
        lost=sum(a['winner']=='candidate' and b['winner']!='candidate' for a,b in pairs)
        extra_summary.append(dict(deck=deck,games=20,v1_wins=old_wins,v2_wins=new_wins,gained=gained,lost=lost))
        lines.append(f'| {names[deck]} | {old_wins}/20 | {new_wins}/20 | {gained} | {lost} |')
    analysis['additional_fresh_mirrors']=extra_summary
    (p/'analysis.json').write_text(json.dumps(analysis,indent=2)+'\n')
    lines+=['', '[Fixed supplemental plan](confirm-plan.json) and [all supplemental records](confirm-report.json). Each version uses the same decks, seeds, and seats against meta-v1. No tuning used these results.', '']
lines+=['## Focused validation','', 'All 512 evaluation, control, and supplemental games ended normally, with zero rejected committed commands and a maximum of 768 search attempts per decision. See [validation summary](validation-summary.json).', '', '71 focused tests passed: 12 engine, 38 adapter/deck, and 21 bot-lab. Engine and adapter type checks, focused bot-lab type checks, automation lint, and whitespace checks passed. The three new regressions replay accepted native commands from setup to the original bad positions.', '', '[Investigation, confirmed causes, changes, and development results](investigation/review.md).', '']
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
