import json
import math
import random
from collections import Counter, defaultdict
from pathlib import Path
from statistics import mean, median

root = Path(__file__).resolve().parent
report = json.loads((root / "report.json").read_text())
original = json.loads((root.parent / "season3-suite/report.json").read_text())
decks = json.loads((root / "decks.json").read_text())
ids = [deck["id"] for deck in decks]
names = {deck["id"]: deck["name"] for deck in decks}
matches = report["matches"]
assert len(matches) == 1280 and report["summary"]["blocks"] == 360
assert len({(m["blockId"], m["legId"]) for m in matches}) == 1280
assert len({m["seed"] for m in matches}) == 1280
assert report["engineRevision"] == original["engineRevision"]
assert report["cardCatalogHash"] == original["cardCatalogHash"]
for index in range(4):
    worker = json.loads((root / f"worker-{index}-metadata.json").read_text())
    assert worker["engineRevision"] == report["engineRevision"]
    assert worker["cardCatalogHash"] == report["cardCatalogHash"]
assert not list(root.glob("exceptions-*.jsonl")), "Inspect native exceptions before review"


def block_index(match):
    return int(match["blockId"].rsplit("/block-", 1)[1])


def ranks(values):
    ordered = sorted(values, reverse=True)
    return [(ordered.index(value) + 1 + len(ordered) - ordered[::-1].index(value)) / 2
            for value in values]


def percentile(values, proportion):
    ordered = sorted(values)
    position = (len(ordered) - 1) * proportion
    lower = math.floor(position)
    upper = math.ceil(position)
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (position - lower)


def correlation(left, right):
    lm, rm = mean(left), mean(right)
    numerator = sum((a-lm)*(b-rm) for a, b in zip(left, right))
    denominator = math.sqrt(sum((a-lm)**2 for a in left) * sum((b-rm)**2 for b in right))
    return numerator / denominator


wins = [[0 for _ in ids] for _ in range(10)]
played = [[0 for _ in ids] for _ in range(10)]
unresolved = [[0 for _ in ids] for _ in range(10)]
first_wins = [0 for _ in ids]
second_wins = [0 for _ in ids]
first_games = [0 for _ in ids]
second_games = [0 for _ in ids]
matrix = defaultdict(lambda: [0, 0, 0])
first_seat_total = 0
for match in matches:
    block = block_index(match)
    assert 0 <= block < 10
    if match["winner"] is not None:
        first_seat_total += (match["winner"] == "candidate") == (match["candidateSeat"] == "p1")
    if match["candidateDeckId"] == match["baselineDeckId"]:
        continue
    for role in ["candidate", "baseline"]:
        other = "baseline" if role == "candidate" else "candidate"
        deck_id = match[f"{role}DeckId"]
        index = ids.index(deck_id)
        won = match["winner"] == role
        played[block][index] += 1
        wins[block][index] += won
        unresolved[block][index] += match["winner"] is None
        first = (match["candidateSeat"] == "p1") == (role == "candidate")
        (first_games if first else second_games)[index] += 1
        (first_wins if first else second_wins)[index] += won
        cell = matrix[(deck_id, match[f"{other}DeckId"])]
        cell[0] += won
        cell[1] += 1
        cell[2] += match["winner"] is None
assert all(count == 28 for row in played for count in row)
assert all(count == 140 for count in first_games + second_games)
assert len(matrix) == 56 and all(cell[1] == 40 for cell in matrix.values())
old_by_key = {(m["blockId"], m["legId"]): m for m in original["matches"]}
assert len(old_by_key) == 128
assert all(old_by_key[(m["blockId"], m["legId"])] == m for m in matches if block_index(m) == 0)
total_wins = [sum(row[index] for row in wins) for index in range(8)]
holdout_wins = [sum(row[index] for row in wins[1:]) for index in range(8)]
aggregate_ranks = ranks(total_wins)
original_ranks = ranks(wins[0])
holdout_ranks = ranks(holdout_wins)
block_ranks = [ranks(row) for row in wins]

# Resample complete seed blocks, retaining paired seats and matchup weights.
# This captures between-seed variation without treating every leg as IID.
rng = random.Random(20261012)
bootstrap = []
for _ in range(20000):
    sampled = [rng.randrange(10) for _ in range(10)]
    bootstrap.append([sum(wins[block][index] for block in sampled) / 280 for index in range(8)])

ranking = []
for index, deck_id in enumerate(ids):
    sampled = [row[index] for row in bootstrap]
    ranking.append({
        "deckId": deck_id, "name": names[deck_id], "rank": aggregate_ranks[index],
        "originalRank": original_ranks[index], "holdoutRank": holdout_ranks[index],
        "wins": total_wins[index], "games": 280,
        "unresolved": sum(row[index] for row in unresolved),
        "winRate": total_wins[index] / 280, "originalWinRate": wins[0][index] / 28,
        "holdoutWinRate": holdout_wins[index] / 252,
        "firstSeatWins": first_wins[index], "firstSeatGames": 140,
        "secondSeatWins": second_wins[index], "secondSeatGames": 140,
        "blockWins": [row[index] for row in wins],
        "blockRanks": [row[index] for row in block_ranks],
        "seedRankRange": [min(row[index] for row in block_ranks), max(row[index] for row in block_ranks)],
        "firstRankBlocks": sum(row[index] == 1 for row in block_ranks),
        "tiedFirstBlocks": sum(row[index] > 1 and row[index] == min(row) for row in block_ranks),
        "topThreeBlocks": sum(row[index] <= 3 for row in block_ranks),
        "blockBootstrap95": [percentile(sampled, 0.025), percentile(sampled, 0.975)],
    })
ranking.sort(key=lambda row: (row["rank"], row["name"]))
gaps = []
for left, right in zip(ranking, ranking[1:]):
    i, j = ids.index(left["deckId"]), ids.index(right["deckId"])
    sampled = [row[i] - row[j] for row in bootstrap]
    gaps.append({"higherDeckId": left["deckId"], "lowerDeckId": right["deckId"],
                 "gap": left["winRate"] - right["winRate"],
                 "pairedBlockBootstrap95": [percentile(sampled, .025), percentile(sampled, .975)]})
failures = [m for m in matches if m["termination"] not in {"rules-win", "deck-out", "player-concession"}]
new_matches = [m for m in matches if block_index(m) > 0]
original_top_three = set(ids[i] for i in sorted(range(8), key=lambda i: wins[0][i], reverse=True)[:3])
aggregate_top_three = set(row["deckId"] for row in ranking[:3])
holdout_top_three = set(ids[i] for i in sorted(range(8), key=lambda i: holdout_wins[i], reverse=True)[:3])
summary = {
    "matches": 1280, "newGames": 1152, "reusedGames": 128, "blocksPerPair": 10,
    "crossDeckGames": 1120, "mirrorGames": 160, "gamesPerDeckExcludingMirrors": 280,
    "terminationCounts": dict(Counter(m["termination"] for m in matches)),
    "newTerminationCounts": dict(Counter(m["termination"] for m in new_matches)),
    "rejectedProposals": sum(m.get("diagnostics", {}).get("illegalProposals", 0) for m in matches),
    "hardFailureCount": report["summary"]["hardFailureCount"], "failures": failures,
    "firstSeatWins": first_seat_total, "firstSeatWinRate": first_seat_total / 1280,
    "ranking": ranking, "adjacentRankingGaps": gaps,
    "originalTopThreeHold": original_top_three == aggregate_top_three,
    "originalTopThreeHoldInNewBlocksOnly": original_top_three == holdout_top_three,
    "rankCorrelationWithOriginal": correlation(original_ranks, aggregate_ranks),
    "holdoutRankCorrelationWithOriginal": correlation(original_ranks, holdout_ranks),
    "matchups": [{"deckId": key[0], "opponentDeckId": key[1], "wins": cell[0], "games": cell[1], "unresolved": cell[2]}
                 for key, cell in sorted(matrix.items())],
    "uncertaintyMethod": "20,000 paired bootstrap resamples of ten complete seed blocks; 95% percentile intervals; fixed random seed 20261012. Mirrors excluded from rankings. Original block retained; separate nine-block holdout comparison also reported.",
}
(root / "analysis.json").write_text(json.dumps(summary, indent=2) + "\n")

fmt = lambda value: f"{value:g}"
lines = ["# Season 3 ranking stability — 12 October 2026", "",
         "1,280 scheduled native games across ten seed blocks per matchup: 36 matchup pairs, 1,120 cross-deck games, and 160 mirrors.",
         "The source and catalog hashes match the first sweep. Its 128 records were retained, and 1,152 new games were executed on four independent native workers. All players use unchanged `meta-v1` oracle behavior and exact stored main decks; no sideboarding.", "",
         f"Terminations: {summary['terminationCounts']}. Hard failures: {summary['hardFailureCount']}. Rejected command proposals: {summary['rejectedProposals']}.",
         f"First seat won {first_seat_total}/1280 ({first_seat_total/1280:.1%}). Median game length: {median(m['turnCount'] for m in matches):g} turns and {median(m['actionCount'] for m in matches):g} accepted commands.", "",
         "## Do the rankings hold?", "",
         f"Original top-three group retained: {summary['originalTopThreeHold']}. Retained using only the nine new blocks: {summary['originalTopThreeHoldInNewBlocksOnly']}.",
         f"Spearman rank correlation with the first sweep: {summary['rankCorrelationWithOriginal']:.3f}; nine new blocks only: {summary['holdoutRankCorrelationWithOriginal']:.3f}. Tied win totals use average ranks.", "",
         "Valen, Death, and War retain positions 1, 2, and 3 in aggregate, including the new-only comparison. Their individual seed-block positions vary. The paired intervals for Valen versus Death and Death versus War include zero, so the exact order within that leading group is not firmly resolved.",
         "War leads fourth-place Kilimanjaro by 20.0 percentage points; the paired seed-block interval is 13.9 to 26.1 points. Kilimanjaro and Clarity–silou form the middle group. The four original tied positions resolve into Kilimanjaro fourth, Clarity–silou fifth, Hyper Aggro sixth, and undefendable seventh.",
         "First-seat wins rise from 51.6% in the original sweep to 58.2% in the expanded sample. All rankings use exactly equal first- and second-seat exposure.", "",
         "Mirrors are excluded. Every deck has 280 cross-deck games, split 140 per seat. The new-only column uses 252 games per deck.", "",
         "| Deck | Rank: first → expanded | Wins / 280 | Expanded rate | New-only rate | 95% seed-block interval | Rank range by seed block |",
         "|---|---:|---:|---:|---:|---:|---:|"]
for row in ranking:
    low, high = row["blockBootstrap95"]
    lines.append(f"| {row['name']} | {fmt(row['originalRank'])} → {fmt(row['rank'])} | {row['wins']} | {row['winRate']:.1%} | {row['holdoutWinRate']:.1%} | {low:.1%}–{high:.1%} | {fmt(row['seedRankRange'][0])}–{fmt(row['seedRankRange'][1])} |")
lines += ["", "## Uncertainty in adjacent ranking positions", "",
          "Intervals below use paired differences from the same resampled seed blocks. A range that includes zero does not support a firm ordering of those two decks under this sample.", "",
          "| Higher aggregate deck | Lower aggregate deck | Win-rate gap | 95% paired interval |",
          "|---|---|---:|---:|"]
for gap in gaps:
    low, high = gap["pairedBlockBootstrap95"]
    lines.append(f"| {names[gap['higherDeckId']]} | {names[gap['lowerDeckId']]} | {gap['gap']*100:.1f} pp | {low*100:.1f} to {high*100:.1f} pp |")
lines += ["", "## Seed-block results", "", "Cells are cross-deck wins out of 28 within each complete seed block. Block 0 is the initial run.", "",
          "| Deck | " + " | ".join(str(i) for i in range(10)) + " |",
          "|---|" + "---:|" * 10]
for row in ranking:
    lines.append(f"| {row['name']} | " + " | ".join(str(w) for w in row["blockWins"]) + " |")
lines += ["", "## Seat effects", "", "| Deck | First seat wins / 140 | Second seat wins / 140 |", "|---|---:|---:|"]
for row in ranking:
    lines.append(f"| {row['name']} | {row['firstSeatWins']} | {row['secondSeatWins']} |")
lines += ["", "## Matchup matrix", "", "Cells are row-deck wins out of 40 cross games; each seat has 20 games.", "",
          "| Deck | " + " | ".join(str(i+1) for i in range(8)) + " |", "|---|" + "---:|" * 8]
for index, deck_id in enumerate(ids):
    cells = ["—" if deck_id == other else f"{matrix[(deck_id, other)][0]}/40" for other in ids]
    lines.append(f"| {index+1}. {names[deck_id]} | " + " | ".join(cells) + " |")
lines += ["", "## Method and limits", "", summary["uncertaintyMethod"],
          "These intervals describe variation under this fixed bot, matchup weighting, and seed scheme. They do not establish tournament or human-player deck strength. Decks differ in how well the shared heuristic uses their cards. Construction-invalid lists are allowed for this casual experiment.",
          "Some source links changed after Season 3. These stored snapshots are not certified historical tournament submissions. Native completion is not proof of every card rule, browser prompts, hosted transport, persistence, or deployment.",
          f"Evaluator verdict: `{report['verdict']}` ({'; '.join(report['verdictReasons'])}). This is a strategy-promotion gate, not a ranking-stability or suite-completion verdict. No strategy or default was changed.", "",
          "## Evidence and reproduction", "",
          "[Manifest](manifest.json), [schedule](schedule.json), [full report](report.json), [analysis](analysis.json), [metadata](run-metadata.json), [decks](decks.json), and [combined match journal](matches.jsonl). Each worker also has a native match journal and source metadata.",
          "From `tools/bot-lab`, run `bun reports/alpha-clash/2026-10-12/season3-seeds/run-seeds.ts`, then `python3 reports/alpha-clash/2026-10-12/season3-seeds/review-seeds.py`. Journals allow the runner to resume completed native records. The standard evaluator builds the final report from those records; it does not fabricate or simulate cached outcomes.", ""]
if (root / "replay-checks.json").exists():
    replay = json.loads((root / "replay-checks.json").read_text())
    lines += ["## Replay checks", "", f"{sum(c['exact'] for c in replay['checks'])}/{len(replay['checks'])} sampled complete match-record replays matched. {replay['scope']}", "[Replay evidence](replay-checks.json).", ""]
(root / "review.md").write_text("\n".join(lines))
print(json.dumps({key: summary[key] for key in ['terminationCounts', 'hardFailureCount', 'rejectedProposals', 'firstSeatWinRate', 'originalTopThreeHold', 'originalTopThreeHoldInNewBlocksOnly', 'rankCorrelationWithOriginal', 'ranking', 'adjacentRankingGaps']}, indent=2))
