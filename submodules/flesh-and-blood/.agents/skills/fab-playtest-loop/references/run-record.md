# Persistent run records

Use one directory per run under
`submodules/flesh-and-blood/reports/browser-playtest/<run-id>/`.
Prefer a timestamp plus short matchup name; check it does not exist before
creating it. Keep one owner/writer. When resuming, preserve original evidence
and append corrections rather than rewriting past outcomes.

The following are record formats, not files to create empty in advance.
Create a game or finding file when there is an actual event to record.
Use relative links to screenshots, logs, regressions and decisions. Keep bulky
runtime artifacts local; only publish them when requested and appropriate.

## `run.md` — current checkpoint and ledger

Record:

- Run ID, owner thread, created/updated timestamps; status `running`, `paused`,
  `blocked`, or `complete`; latest requested scope/limits and source session.
- Mode: two-seat manual practice, human-vs-bot browser practice, or actual
  multiplayer; actor/tool availability. Only the first is the default here.
- Target streak and current streak; last reset event and reason.
- Repository HEAD plus relevant dirty diff/build fingerprint, build time,
  serving process/URL and relevant changes since the previous game. HEAD alone
  cannot identify the running code in a dirty shared checkout. Save the scoped
  diff or a reproducible digest of it when needed to identify that build.
- Exact deck snapshot or materialized list reference/digest, pitch colors,
  main-deck/inventory/loadout, starting hero faces, seed and first player for
  each game. Record corrections from the user's supplied list.
- Browser/session IDs and current game ID where exposed; controlled seat,
  interaction actor, turn/phase, public board summary and relevant seat plan.
- Open finding IDs, pending verification, relevant lesson IDs, and exact next
  browser action or repair command. Keep private seat notes distinct.

Maintain a game table:

| Game | Build/deal/first seat | Terminal result + evidence | Findings/workarounds | Eligible? | Streak after |
| --- | --- | --- | --- | --- | --- |

For each row, link the game record. Distinguish a real win/loss/draw from a crash,
reload, action cap, deliberate diagnostic concession, or interrupted game.
Update the ledger before starting the next game. Include links to the most
recent before/after repair proof and any remaining blockers.

On resume, compare the checkpoint with the actual browser. If handles are
stale, rediscover the run's tab by URL and game identity. If the game was reset,
lost, or its build changed, record invalidation and reset the streak. Do not
replay the checkpoint's next click until its actor and state are verified.

## `game-001.md` — decisions and browser evidence

Record setup/build/deal identities and screenshots of the initial board. For
each new hand, capture a concise seat-specific decision brief:

```text
Turn / seat / current face / life:
Known hand + public board:
Primary line and target; pitch/action/resource budget:
Defense and equipment reserve; arsenal/future-turn intent:
Meaningful alternative and tradeoff:
What would change this plan:
Relevant lesson IDs:
```

Append brief decision records as play proceeds:

```text
Window / actor / observed state:
Chosen action and expected result; plan retained or revised (why):
Actual player control used:
Rendered result + relevant log entries:
Evidence link / finding ID if needed:
```

This is an action audit with concise rationale, not a transcript of internal
reasoning. Capture a fresh screenshot at material visual changes and suspected
defects; ordinary actions may reference a short rendered-state/log record.

At end, include terminal screenshot and result, both seats' final life/face,
final log/history audit, post-game interactions tried, console errors if
available, screenshots/viewports actually inspected, findings and workarounds,
strategic mistakes and lessons, and explicit eligibility decision. Label
unavailable evidence rather than fabricating it.

## `findings/F001.md` — reproduction through resolution

- Status: `suspected`, `confirmed`, `fixed-awaiting-browser`, `verified`,
  `dismissed`, or `blocked`; category and player impact.
- Game/build, turn/seat/actor, exact card names/colors and starting state.
- Short reproducible click sequence, expected outcome with rule/card citation
  or concrete UX expectation, actual result and evidence.
- Whether normal play could continue; workaround and its effect on eligibility.
- Root-cause owner and relevant source; distinguish observation from inference.
- Scoped change, meaningful regression and commands/results actually run.
- Served build identity and browser replay of the original failure path;
  screenshots/logs showing the repaired outcome and next interaction.
- Dismissal/correction rationale when a suspicion was wrong; lesson IDs.

Only `verified` or supported `dismissed` findings are closed for acceptance.
A code edit or green engine test alone leaves a browser failure unverified.

## Learning changes

Append lesson candidates to the game record, then link promoted entries in the
canonical notebook. For procedural instruction changes also record old/new
guidance, the failure that motivated it, validation and rollback condition.
Retain superseded entries with their replacements so future runs understand
why an earlier policy or card interpretation was abandoned.
