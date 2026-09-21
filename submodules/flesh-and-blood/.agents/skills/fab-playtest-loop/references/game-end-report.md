# End-of-game report (required)

After every completed or abandoned game in a browser playtest run, issue a
**game-end report** before starting the next game. This is mandatory for pace,
diagnostic, and clean-streak games alike.

## Where to write it

1. Append a `## Game-end report` section to that game’s record
   (`games/game-NN.md`).
2. Add one row / note on the run ledger (`run.md`) pointing at new findings.
3. Tell the user in chat with a short summary (result, turn, clean eligibility,
   new/open findings). Pace/diagnostic completions still get this summary.
4. If the game confirmed **new** product defects (or materially changed an open
   finding), create or update a tracker ticket (Linear preferred for The Card
   Goat Online) and link the ticket URL from the game record and `run.md`.

Do not skip the report because the game was diagnostic, bot-assisted, or a loss.

Before each game, the run must also sync the checkout to `origin/main` (see the skill section **Sync checkout with origin/main**); record that SHA in the game record opening and here.

## Report template (copy into `games/game-NN.md`)

```markdown
## Game-end report

- Result: <win/loss/draw/unfinished> — <hero life totals>
- Turn / duration: <n> / <approx>
- Mode: <both manual | pace bot on <seat> | other>
- Clean streak eligible: <yes/no> — <why if no>
- Serving: <URL/port/build identity>
- Synced origin/main SHA: <sha> (submodules if relevant)
- Seed / fixture: <id>
- Terminal evidence: <screenshot path(s)>

### Findings this game

| ID   | Status                       | One-line | Ticket      |
| ---- | ---------------------------- | -------- | ----------- |
| F0xx | new / reproduced / dismissed | …        | TCGO-… or — |

### QA / UX notes

- Agency / priority clarity:
- Feedback / disabled reasons:
- Logs / history:
- Bot / Auto-pass / Take Over friction:

### Lessons / next game

- Strategy or process note to carry forward:
- Exact next action:
```

## Ticket hygiene

- Bundle closely related defects from one run into one ticket when that helps
  triage; keep distinct HIGH bugs with separate repro steps clearly sectioned.
- Link evidence paths under `reports/browser-playtest/<run-id>/`.
- Do not file tickets for player mistakes or rules-correct “Action unavailable”
  without a ruling; record them as suspected until confirmed.
