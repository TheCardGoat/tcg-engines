# Manual visual validation - 2026-05-22

These checks cover digest items that are intentionally not fully represented by
engine unit tests. Use the fixture route when a deterministic simulator state is
available; use the replay id to compare against the player report.

| Scenario                       | Replay                             | Route                                                       | Validation focus                                                                                                                                                                                    |
| ------------------------------ | ---------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desperate Plan discard chooser | `mgwHPweIY8WbYq9hWAqz2Bc`, turn 14 | `/tests/regressions/bug-66-desperate-plan-discard-step`     | Play through click-to-play and drag/drop when both are available. Confirm the chooser opens, zero discard draws zero, one discard draws one, and multiple discards draw the same count.             |
| Mirabel mobile prompt          | `mgPhI4ZWHvdLtbIVE-jXmRj`, turn 11 | `/tests/triage-2026-05-17-mirabel-curious-child-reveal`     | In mobile responsive mode, accept the optional prompt, select the song, confirm it reveals, verify +1 lore, and check for clipping between hand cards, prompt drawer, and confirmation controls.    |
| Woody / Toys follow-up         | `mgIWIBbVtg8QePn6QTO6uDj`, turn 11 | `/tests/triage-2026-05-22-woody-under-the-sea-toy-followup` | Cast Under the Sea into Woody plus a damaged 1-base-willpower Toy. If the Toy remains in play after Woody leaves, capture before/after board state and card instance IDs for a separate engine fix. |
| Liquidator rules expectation   | `mgYDIn-sWpq2j3KQ4Dm3y6J`, turn 1  | `/tests/triage-2026-05-22-liquidator-turn-one-expectation`  | Confirm a first player with only 1 ink cannot play Liquidator. If a play path appears, capture the available move as a targeted issue.                                                              |

## Runtime-only flow

Reconnect and drop-opponent behavior needs staging or a controlled local runtime,
not a static board fixture.

Replay references: `mgbnBzW5lZihd3RlQ3i6vnw`,
`mgNjfC5kp--4m6yWpwlIB6A`, `mgnOxgqCXNPi-RfPbLB33dM`.

Manual checklist:

- Start a Lorcana match in staging or a controlled local runtime.
- Force a client disconnect and reconnect during the match.
- Verify the client exits `reconnecting` after websocket/game-state heartbeat resumes.
- Force opponent abandonment and wait past the drop threshold.
- Verify the drop-opponent control appears, sends the expected command, and transitions the match correctly.
- Capture browser console logs, websocket frames, and game-server logs for any failure.
