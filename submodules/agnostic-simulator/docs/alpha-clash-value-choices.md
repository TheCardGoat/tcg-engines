# Alpha Clash value choices

Start commit: `9fafe2b855` on `codex/live-opening-integration`.

The compact R3F prompt and the action drawer use `BoundedNumberControl`.
A number draft starts empty. Bounds and step are visible. Typing does not round
or clamp the value. The shared draft only advances after a finite value meets
its bounds and step. Zero is an explicit valid choice when the minimum is zero.

## Native fixtures

- `/alpha-clash/simulator/tests/prompt-health-payment`: From Life to Death
  (`ac-ac5-032`) answers Sonoro's attack. Choose 0–4 health, then Sonoro.
  Cancel before the target commits the response to keep the card, health,
  and resources. Reopen the action to retry. Pass both response windows to
  send Sonoro to Oblivion and banish From Life to Death.
- `/alpha-clash/simulator/tests/prompt-number`: Mean-Streak's native counter
  transfer. Cancel transfer submits zero; the ability remains used this turn.

Health-payment limits come from the authored card and projected current health.
The adapter forwards `healthReduction` to the native `respond` command.
It no longer truncates fractional counter choices into legal integer choices.
No engine rule, card definition, protocol schema, or hosted transport changed.

Rules basis: Alpha Clash Comprehensive Rulebook v8.0, 107.1 (integers),
107.1c (zero for any number), 107.3 (X), and 115.3c (health payment).
Source: https://alphaclashtcg.com/how-to-play and the Alpha Clash rules skill.

## Validation on 2026-10-08

114 focused tests passed:

- 9 native health-payment adapter tests: 0/1/4 health, resource discounts,
  actual target resolution and banish, bounds by current health, hidden hand,
  rejection without mutation, and retry.
- 20 native visual-fixture tests, including fractional Mean-Streak rejection
  without truncation and a successful zero retry.
- 15 compact shared prompt tests: empty, negative, fractional, excessive,
  zero, maximum, and declared cancel behavior.
- 70 shared prompt, draft, and optional-cost tests.

Shared UI type check, focused lint, and whitespace check passed.
Adapter type checking still fails at Alpha Clash `effects.ts:1934` because
`selectCards.prompt` is absent from one union member. Two trap-response tests
also fail (Destructive Arrival setup and Clash Buff target input). Running
those checks with both adapter source files restored to the starting commit
reproduced the same failures. They are outside this change.

In-app browser proof used the production R3F board at `http://127.0.0.1:5238`:

- Empty, -1, 0.5, and 5 kept Confirm disabled; 0 and 4 were accepted.
- Cancel at 4 preserved 8 health, five ready resources, and the hand card;
  reopening started empty.
- Zero spent five resources and preserved 8 health. The visible log recorded
  Sonoro sent to Oblivion and From Life to Death banished.
- Four spent one resource and reduced health from 8 to 4.
- The zero flow completed with reduced-motion emulation enabled. The compact
  prompt stayed usable at 844×390 and 1280×720. Emulation was reset afterward.
- No browser warning or error was captured during the tested flow.

Number entry and cancellation add no sound cue; existing board sound setup is
unchanged. Audible output was not verified. This is local native-engine and
browser proof, not hosted-match, deployment, or physical-device proof.

## Integration

Apply this scoped commit after `9fafe2b855`. It touches shared prompt files also
used by other games; retain the explicit numeric validation when resolving any
concurrent prompt edits. No dependency on another agent's commit is required.
No PR, merge, or deployment was performed.

## Human QA steps

Use the local server at `http://127.0.0.1:5238`. It serves this isolated
worktree, including commit `07bb826a7f`. Reload the page to reset a fixture.
Both seats are controlled locally. The view changes seats when priority moves;
this is expected. Track the defending Contender, not only the label "You".

If the server is stopped, run from this worktree:

```sh
cd /Users/wazar/.codex/worktrees/alpha-value-choices/the-card-goat-online/submodules/agnostic-simulator/apps/multi-game-simulator
GAME_SLUG=alpha-clash VITE_OPTIMIZE_DEPS_DISCOVERY=false vp dev --host 127.0.0.1 --port 5238 --strictPort
```

### Health payment

1. Open `/alpha-clash/simulator/tests/prompt-health-payment`.
   Start: defending Contender has 8 health, five ready resources, one hand card.
2. Select **More → Counter with From Life to Death**, then close the action
   drawer. The board prompt must show the source card, 0–4, whole numbers,
   and an empty Amount. Confirm must be disabled.
3. Enter `-1`, `0.5`, `5`, then clear Amount. Confirm must stay disabled.
   The number must not silently become a legal payment. No card, health,
   resource, or target may change.
4. Enter `4`, select **Cancel**, then reopen the same action.
   Health remains 8, five resources remain ready, and the card remains in hand.
   The reopened Amount is empty.
5. Enter `0`, select **Confirm health payment**, then select Sonoro on the
   board. The defending Contender keeps 8 health and all five resources become
   spent. Select **Pass** twice. Sonoro leaves the Clash Zone. Open **More**:
   the log must say Sonoro was sent to Oblivion and From Life to Death banished.
6. Reload and repeat with `4`. After selecting Sonoro, the defending Contender
   has 4 health and four resources remain ready. Pass twice and check the same
   resolution log. Also try `1`: expect 7 health and one ready resource.
7. Try the amount with keyboard Tab and Enter. Inspect the source card preview.
   Repeat on a real phone in landscape, and with reduced motion enabled.
   Check that the input, limits, source, Confirm, and Cancel remain readable
   and usable. Number entry and cancellation are silent by design.

### Counter count

1. Open `/alpha-clash/simulator/tests/prompt-number`.
   The prompt is already open; Sonoro starts with three Streak Counters.
2. Confirm is disabled for empty Amount, `-1`, `0.5`, and `4`.
   Zero and three are valid. The source is Mean-Streak; the transfer says
   Sonoro to Magnate.
3. Enter `3` and select **Cancel transfer**. Sonoro keeps all three counters.
   The ability remains used this turn. Reload to retry the fixture.
4. Enter `3` and select **Move counters**. Sonoro has none and Magnate has
   three. Reload; repeat with `0`. Sonoro keeps all three and the prompt closes.

Record a failure with the fixture URL, entered value, action, expected result,
actual result, viewport, and a screenshot. Stop human sign-off if any required
result above fails.

## QA recheck before human handoff

On October 8, 2026, the agent reran all 114 focused tests and the shared UI type
check: all passed. The agent repeated health payments 0 and 4, invalid values
(including non-finite `1e309`), Cancel and retry, keyboard confirmation,
target selection, both response passes, and the visible resolution log.
The agent also repeated Mean-Streak invalid counts, Cancel transfer, transfer
3, and transfer 0. With reduced motion emulated, the prompt's computed
animation was `none` and zero transfer completed. Browser warnings/errors
were empty. No new defect was found in these tested flows.

Human QA is ready for visual, real-device, and audible checks. It does not
replace hosted-match integration testing. The baseline failures listed above
remain separate from this local feature check.

## QA recheck after main sync, October 9, 2026

After merging `origin/main` (merge `013e212a17`), the focused tests were rerun:
health-payment 9/9, simulator-ui prompt suites 55/55, alpha-clash
visual-fixtures 24/24, and the shared UI type check passed. The adapter suite's
11 failures are inherited (5 at the old base, 6 from main's known red map);
none are new.

A headless Chromium pass then drove 27 UI checks to green with no console or
page errors: both payments 0 and 4 through full resolution (target selection,
board Pass twice, Sonoro to Oblivion, From Life to Death banished in the log),
invalid values never enabling Confirm, cancel leaving health and resources
untouched with an empty Amount on reopen, keyboard-only Tab+Enter confirmation,
silence during number entry and cancellation (zero audio calls), reduced-motion
emulation (prompt animation `none`, zero transfer completing), cancel transfer
and transfer 0 keeping all counters on Sonoro, transfer 3 landing on Magnate,
and a phone-landscape (844x390) compact layout keeping the source, range hint,
input, Confirm, and Cancel inside the viewport.

Driver notes for future automation: selecting the board target auto-submits the
counter; the response window is passed with the board-level Pass button, not a
drawer entry; the seat view flips when the counter is submitted, so assert
health by number ("8 of 30 health"), not by the "You" prefix; resource counts
are only in the zone buttons' accessible names ("resources · 4 ready / 5
total"), not in body text.
