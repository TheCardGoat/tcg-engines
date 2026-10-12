# Board target selection

Open `/alpha-clash/simulator/tests/prompt-target-change`.

Play entirely with board gestures; the Match drawer is a dev affordance, not the
player path.

1. Click **Target List in your hand** (or drag it onto the Accessory Zone). The
   card plays immediately: a resource is spent and the response window opens.
   Playing no longer asks for a target — triggered abilities declare targets
   after the card enters play (rule 603.3d), so there is a single entry point.
2. Pass the response window (the local fixture may switch your seat; click
   **Pass** when offered). A `Declare target 1` prompt then appears.
3. Click the opposing **Sonoro**. A target handle appears above it.
4. Drag that handle to the opposing **Magnate**, or activate the handle and
   click Magnate. An illegal drop (your own lower-row Sonoro) is rejected and
   keeps the original target.
5. Click the handle, press Escape: movement mode ends, the selection stays.
6. Click **Confirm choice**. The Bounty Counter resolves onto Magnate.
7. Check the player status strip: `Magnate, Cunning Planner: 1 bounty
counters.`, Sonoro clean, Target List in your Accessory Zone, resources 5/6.

This fixture uses official Target List (`ac-ac3-102`), `AcTestEngine.fromFixture`,
the production server adapter, and the normal practice/live R3F arena. Resolution
is authoritative engine behavior. No preview resolution or developer overlay is used.

The existing `prompt-targets` fixture still selects the source and destination for
Mean-Streak's counter transfer. Card choices now require confirmation so their
markers can be changed before committing each native choice.

## Ownership and rules

`BoardTargetHandles` is a game-independent DOM control positioned from R3F card
anchors. It preserves a marker by selection slot, shows numbers for ordered inputs,
and never changes game state. The Alpha Clash board writes changes to the shared
interaction draft. Candidate IDs and hidden information come from the viewer projection.

The optional protocol hint `confirmBeforeSubmit` keeps a target draft open until
confirmation. Other games keep their existing immediate-selection defaults.
Alpha Clash applies the hint to target inputs and card-linked option inputs.

Play-time target inputs are scoped to the played card's own effects; activated
abilities declare their own targets at activation, and triggered abilities
declare through the native prompt. This keeps one authority per declaration.

Rule 113.1 declares targets before Standby and prohibits later changes without an
explicit card effect. This interaction changes an uncommitted draft; it does not
implement a card effect that changes a committed target. Rule 113.3 prohibits
selecting the same target twice for one target instance. The marker replacement
control rejects duplicates and candidates outside the current legal set.

## Validation, 2026-10-09 (post-sync)

- Adapter: chosen target inputs are collected per owning effect tree (play vs
  activation), removing the duplicated pre-play target declaration for
  triggered cards. Adapter suite shows the same 11 pre-existing failures as
  origin/main (none added or fixed by this branch).
- Focused suites: prompt fixtures (declare-prompt rejection of friendly/hidden
  choices, single Bounty Counter), target-handle draft change/cancel/retry,
  interaction preview, SharedInteractionPrompt, draft context, practice page.
- In-app browser, board gestures only: click-to-play from hand, response pass,
  declare-target prompt, handle select, drag retarget ("Target 1 changed."),
  Confirm choice, final `1 bounty counters` on Magnate with 5/6 resources.
- Hot-seat perspective: follows the turn (flips with callout + fade on turn
  handoff, stable through response windows); bot mode pins to Player 1.
- Drag-to-Accessory exists (drop zone labelled "Play Accessory") but could not
  be exercised by synthetic drags: dnd-kit collisions never resolve in the
  in-app browser (dest=null for Clash-card drops too). Human QA should drag
  Target List onto the Accessory Zone once.
- App typecheck has pre-existing errors in cyberpunk files only; no changed-file
  diagnostics.

Local startup required a temporary Vite `ssr.noExternal: [/^@tcg\//]` override
(untracked `vite.target-qa.config.ts`) and the built Flesh and Blood types
package. No platform services were started. Hosted multiplayer and production
deployment were not tested.

## Human QA handoff

Status: ready for local fixture QA on the synced branch.

1. Reload the fixture. Check three cards in your hand and six ready resources.
2. Click **Target List in your hand**. Expect: a card clone flies from your
   hand to the Accessory Zone, resources drop to 5/6, and a response window
   opens. The board must NOT flip perspective when priority moves — a centered
   callout (`Player 2 · takes control`) names the seat now deciding instead.
   Also try dragging it onto the **Accessory Zone** ("Play Accessory") on a
   later repeat.
3. Click **Pass** when the response window offers it (the fixture may switch
   which seat you control; expect the center callout on each switch, and the
   bottom turn chip tracking the acting seat). Keep the board visible; it must
   not recreate its canvas or reload its artwork.
4. When `Declare target 1 …` appears, click **Sonoro in the upper Clash row**.
   Expect one round target handle above it and **Confirm choice** bottom right.
5. Drag the handle onto your lower-row Sonoro. Expect an illegal-target message
   and the original target to stay selected.
6. Drag the handle onto upper-row **Magnate**. Expect "Target 1 changed."
   Also click the handle and then Magnate — both gestures must work.
7. Click the handle, press Escape. Movement mode must end, selection remains.
8. Click **Confirm choice**. Expect the effect to resolve without extra prompts.
9. Check: `Magnate, Cunning Planner: 1 bounty counters.` in the player status
   strip, Sonoro without Bounty Counter, Target List in your Accessory Zone,
   resources 5/6.

Reload to repeat any case. For subjective QA, check that the handle is easy to
find, drag, and use with the keyboard, and that sound volume is comfortable.
This fixture has one target; numbered multiple-target markers have component
coverage and need a separate native effect to test that presentation in a game.

### Follow-up validation, 2026-10-08

Local response seat changes remounted the whole arena. Removed the seat key
from the practice interaction workspace. The draft provider now clears
selections when the actor changes while preserving the board subtree. A
regression test checks that private selections reset even when action/request
IDs match, and that the child subtree mounts only once.

That browser run verified click and drag retarget, illegal friendly drop,
Escape, cancel/restart, native submission, both response passes, and the final
Bounty Counter/log. CDP identified the same canvas node before submission and
after both passes. There were no browser errors or warnings in that run.
