# Alpha Clash mode and option controls

The production R3F board uses `SharedInteractionPrompt` and the game-agnostic
`ContextualChoiceControl`. Boolean responses and single-option selections stay
on the board. Lists longer than six options get case-insensitive search, a result
count, a scroll area, and an empty-result message. Filtering preserves native
option IDs. Disabled choices retain their reason. Card-reference previews remain
separate from the choose action and use only viewer-safe cards.

Native fixtures already in the test index:

- `/alpha-clash/simulator/tests/prompt-modes`: Haven, Hiding in Plain Sight.
  The page opens before Haven is played.
- `/alpha-clash/simulator/tests/prompt-optional`: Denver. The page opens
  before Denver is played.

Both seed real authored cards with public `AcTestEngine` actions and stop
before the card that raises the prompt, so the browser opens on a legal
Primary-phase board with the card in hand. Play the card through the board's
own inspection and play actions to reach its prompt, exactly like a game.
Responses use `AlphaClashServerEngine.submitInteraction`. There is no added
simulated resolution or developer overlay. Reload the URL to reset the
fixture. Required pending choices cannot be cancelled in the contextual prompt
or Match panel. Rejected responses retain their answer for explicit retry.
This does not undo a native command. Sound and reduced-motion settings are
available in Match during play. The choice sound is selection feedback, not
engine-success proof.

## Validation — 2026-10-08

33 focused tests passed across `ContextualChoiceControl.test.tsx`,
`SharedInteractionPrompt.test.tsx`, `choice-controls.native.test.tsx`, and
`prompt-fixtures.test.ts`. They cover invalid IDs, wrong-actor rejection without
mutation, native outcomes, required-choice cancellation, retry, hidden hands,
previews, search reset, unavailable choices, and empty-search recovery.
Type-aware lint passed with two existing warnings on the board's numeric
confirmation label, outside these changes. `git diff --check` passed.

In-app browser, local production board, 1280×720 and 844×390:

- Haven preview left its choice pending. Health mode changed 26 to 28.
- Keyboard Enter selected draw: deck 8 to 7, hand 1 to 2.
- Denver No preserved deck 8 and hand 1. Yes changed deck 8 to 6 and hand 1
  to 3; board discard of Sonoro left hand 2 and Oblivion 1.
- Required mode had no Cancel button in Match.
- One selection audio event was observed with sound enabled. Mute prevented
  a new event. Manual reduced motion produced `animation-name: none`.
- Small choices remained contextual and readable on the landscape viewport.

No authored color/name choice card was found for a native fixture. Color and
long-name inputs are covered at the shared-control/protocol boundary. This is
not hosted-match proof. Existing engine modal timing is unchanged. Rules:
Alpha Clash CR v8.0 101.4b, 105.4, 702.1a–c, via the owning rules skill and
[publisher rulebook index](https://alphaclashtcg.com/how-to-play).

## Integration

Base: `9fafe2b855` on `codex/live-opening-integration`, synced with `origin/main`
on 2026-10-09 (through PR #4339). The sync converged on the same pre-prompt
fixture behavior main had already landed; conflicts resolved to this branch's
shared play-through helper, its extra fixture-start test, and its updated docs.
Concurrent edits to `SharedInteractionPrompt`, its CSS, `AlphaClashInteractions`,
or `AlphaClashArena3D` still need conflict review during integration. No new
package dependency, engine change, or contract change comes from this branch.

## Human QA follow-up

The agent repeated validation before handoff: 65 focused tests and lint passed.
Browser QA found and fixed long-list prompt clipping, missing shared inventory
entries, and a disconnected shared-fixture reduced-motion setting. Color and
long-list shared browser cases are now available. Follow the
[human QA checklist](alpha-clash-choice-controls-qa.md).

## Fixture start — 2026-10-09

`prompt-modes` and `prompt-optional` no longer pre-resolve their card in the
fixture builder. The page now opens before the card is played, and the player
reaches the prompt through real board actions (inspect, play, response window).
The focused tests drive that same play through the production adapter via
`playFixtureCardFromHand` before answering the pending choice.
