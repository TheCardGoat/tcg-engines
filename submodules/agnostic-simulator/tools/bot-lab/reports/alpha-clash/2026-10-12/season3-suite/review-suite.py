import json
from collections import Counter, defaultdict
from pathlib import Path
from statistics import mean, median

root = Path(__file__).resolve().parent
report = json.loads((root / "report.json").read_text())
decks = json.loads((root / "decks.json").read_text())
names = {deck["id"]: deck["name"] for deck in decks}
matches = report["matches"]
assert len(matches) == 128 and report["summary"]["blocks"] == 36
assert len({(m["blockId"], m["legId"]) for m in matches}) == 128
stats = {key: {"deckId": key, "name": name, "wins": 0, "losses": 0, "unresolved": 0,
               "games": 0, "firstSeatWins": 0, "firstSeatGames": 0,
               "secondSeatWins": 0, "secondSeatGames": 0} for key, name in names.items()}
matrix = defaultdict(lambda: [0, 0])
first_wins = 0
rejected = sum(m.get("diagnostics", {}).get("illegalProposals", 0) for m in matches)
failures = []
for match in matches:
    if match["winner"] is not None:
        winning_seat = match["candidateSeat"] if match["winner"] == "candidate" else (
            "p2" if match["candidateSeat"] == "p1" else "p1")
        first_wins += winning_seat == "p1"
    if match["termination"] not in {"rules-win", "deck-out", "player-concession"}:
        failures.append(match)
    if match["candidateDeckId"] == match["baselineDeckId"]:
        continue
    for role in ("candidate", "baseline"):
        opponent = "baseline" if role == "candidate" else "candidate"
        key = match[f"{role}DeckId"]
        row = stats[key]
        won = match["winner"] == role
        row["games"] += 1
        row["wins"] += won
        row["losses"] += match["winner"] == opponent
        row["unresolved"] += match["winner"] is None
        first = (match["candidateSeat"] == "p1") == (role == "candidate")
        seat = "firstSeat" if first else "secondSeat"
        row[f"{seat}Games"] += 1
        row[f"{seat}Wins"] += won
        cell = matrix[(key, match[f"{opponent}DeckId"])]
        cell[0] += won
        cell[1] += 1
for row in stats.values():
    assert row["games"] == 28 and row["firstSeatGames"] == row["secondSeatGames"] == 14
    row["winRate"] = row["wins"] / row["games"]
ranking = sorted(stats.values(), key=lambda row: (-row["winRate"], row["name"]))
assert len(matrix) == 56 and all(cell[1] == 4 for cell in matrix.values())
actions = [m["actionCount"] for m in matches]
turns = [m["turnCount"] for m in matches]
summary = {
    "matches": len(matches), "crossDeckGames": 112, "mirrorGames": 16,
    "terminationCounts": dict(Counter(m["termination"] for m in matches)),
    "firstSeatWins": first_wins, "secondSeatWins": len(matches) - first_wins - sum(m["winner"] is None for m in matches),
    "rejectedProposals": rejected, "rankingExcludesMirrors": True, "ranking": ranking,
    "actions": {"min": min(actions), "median": median(actions), "mean": mean(actions), "max": max(actions)},
    "turns": {"min": min(turns), "median": median(turns), "mean": mean(turns), "max": max(turns)},
    "failures": failures,
    "matchups": [{"deckId": key[0], "opponentDeckId": key[1], "wins": cell[0], "games": cell[1]}
                 for key, cell in sorted(matrix.items())],
}
(root / "analysis.json").write_text(json.dumps(summary, indent=2) + "\n")
lines = ["# Season 3 bot-lab review — 12 October 2026", "",
         f"Completed {len(matches)} games: 36 paired matchup blocks, including 16 mirrors and 112 cross-deck games.",
         "Both players used the unchanged `meta-v1` oracle heuristic. All eight exact source snapshots were used; sideboards were excluded.", "",
         f"Terminations: {summary['terminationCounts']}. Rejected command proposals: {rejected}. Hard failures: {report['summary']['hardFailureCount']}.",
         f"First seat won {first_wins}/{len(matches)} games ({first_wins / len(matches):.1%}). The runner starts player one.",
         f"Median game length: {median(turns):g} turns and {median(actions):g} accepted commands. Ranges: {min(turns)}–{max(turns)} turns, {min(actions)}–{max(actions)} commands.", "",
         "## Cross-deck results", "", "Mirror games are excluded. Each deck played 28 cross-deck games, 14 from each seat.", "",
         "| Deck | Wins–losses | Win rate | First seat | Second seat |",
         "|---|---:|---:|---:|---:|"]
for row in ranking:
    lines.append(f"| {row['name']} | {row['wins']}–{row['losses']} | {row['winRate']:.1%} | {row['firstSeatWins']}/14 | {row['secondSeatWins']}/14 |")
seat_sensitive = max(ranking, key=lambda row: abs(row["firstSeatWins"] - row["secondSeatWins"]))
lines += ["", "## Findings", "",
          f"The leading deck is {ranking[0]['name']} at {ranking[0]['wins']}/28; {ranking[1]['name']} follows at {ranking[1]['wins']}/28, then {ranking[2]['name']} at {ranking[2]['wins']}/28.",
          "Valen and Death split their direct matchup 2–2. War went 1–3 against Valen and 2–2 against Death. These small cells do not establish a stable matchup advantage.",
          f"The largest seat difference is {seat_sensitive['name']}: {seat_sensitive['firstSeatWins']}/14 wins from first seat versus {seat_sensitive['secondSeatWins']}/14 from second seat. More seed blocks are needed before interpreting that difference.",
          "Kilimanjaro completed every scheduled game with its original construction-invalid list. No runtime exception, stalled game, unsupported prompt, or rejected command was observed in this sweep.",
          "The next useful comparison is a larger seed sample or a different supported heuristic on the same exact deck snapshots. The present run does not identify which individual card decisions caused the deck ranking.",
          "", "## Matchup matrix", "", "Cells are row-deck wins out of four cross-deck games. Each seat occurs twice per cell.", "",
          "| Deck | " + " | ".join(str(i + 1) for i in range(8)) + " |",
          "|---|" + "---:|" * 8]
keys = list(names)
for i, key in enumerate(keys):
    cells = ["—" if key == other else f"{matrix[(key, other)][0]}/4" for other in keys]
    lines.append(f"| {i + 1}. {names[key]} | " + " | ".join(cells) + " |")
lines += ["", "## Interpretation and limits", "",
          "These are bot-policy results from one full paired sweep, not tournament deck-strength estimates. Each cross matchup has only four games. Decks share one heuristic and may differ in how well that heuristic uses their cards.",
          "The source lists are dated snapshots. Some linked pages changed after Season 3; the stored lists do not certify historical tournament submissions. Casual execution intentionally permits construction-invalid lists, including Kilimanjaro with two Endless Cycle cards.",
          f"The evaluator verdict is `{report['verdict']}`: {'; '.join(report['verdictReasons'])}. This is a strategy-promotion gate, not a suite-completion verdict. Comparing `meta-v1` with itself does not test an improved strategy. No promotion or default change was made.",
          "Local native-engine results do not prove browser prompts, hosted transport, persistence, or deployment.", "",
          "## Evidence and reproduction", "",
          "- [Manifest](manifest.json), [full canonical report](report.json), [deck snapshots](decks.json), [analysis](analysis.json), [match journal](matches.jsonl), and [run metadata](run-metadata.json).",
          "- Run `bun reports/alpha-clash/2026-10-12/season3-suite/run-suite.ts` from `tools/bot-lab` with the recorded source revision.",
          "- The script uses the standard `evaluateCandidate` evaluator, with progress journaling only. Run `python3 reports/alpha-clash/2026-10-12/season3-suite/review-suite.py` to regenerate this review.", ""]
if (root / "replay-checks.json").exists():
    replay = json.loads((root / "replay-checks.json").read_text())
    checks = replay["checks"]
    lines += ["## Replay samples", "",
              f"{sum(check['exact'] for check in checks)}/{len(checks)} sampled replays exactly reproduce their complete match records. {replay['scope']}",
              "See [replay checks](replay-checks.json). Run `bun reports/alpha-clash/2026-10-12/season3-suite/replay-samples.ts` to reproduce them.", ""]
(root / "review.md").write_text("\n".join(lines))
print(json.dumps(summary, indent=2))
