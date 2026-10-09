# V2 prompt presentation

V1 and V2 render the same prompt components, state, candidate lists, and action
handlers. `PromptSkinContext` defaults to V1. Only `CyberpunkBoardV2` selects V2.
React portals inherit that context, so dialogs do not depend on DOM ancestry.
Keep behavior changes in the shared components and engine; do not copy them into
BoardV2. The context must only select presentation.

## Audited surfaces

| Shared owner                         | Prompt families covered by the V2 skin                                                                                                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PromptBanner`                       | First player, mulligan, waiting, minimized, action selection, target selection, redirect defeat, gain Gig, keep/reroll Gig, steal Gigs, optional trigger, trigger order                        |
| `ChoiceModal`                        | Effect choice, adjust Gig, effect target, discard, prevent Gig steal, triggers, scry, reveal destination, card type, card to move/play, sacrificial Gear, deck search and local target choices |
| `PaymentSelectionPrompt`             | Payment progress, remaining Eddies, cancel                                                                                                                                                     |
| `PromptBanner` and `PassTurnControl` | Existing pass-with-attackers confirmations, using one shared visual stylesheet                                                                                                                 |
| Shared `InteractionResolutionPrompt` | Rival resolution narration, styled inside V2's prompt housing                                                                                                                                  |

The hidden diagnostic InteractionPanel is not a player prompt. Card inspection,
settings, and game-over screens are outside this prompt audit.

In V2, visible board targets are a direct way to act: players can select cards,
Gigs, and hand cards on the board. Gig prompts stay a slim caption — the banner
does not mirror Gain Gig or Steal Gigs choices as buttons. Steal, effect target,
and adjust decisions swell the eligible lane to roughly twice its dice size,
and while "Take a gig die" is up the Fixer pool dice more than double and glow
amber, so the enlarged dice are the controls and the banner shrinks to a micro
caption chip (no housing frame). The choice sheet is reserved for choices
without a useful spatial target, such as hidden-zone searches, effect menus,
and multi-step pairings (prevent Gig steal keeps its pairing modal). V1 keeps
its existing prompt controls and sizing.

## Visual rules

Use the card fonts, restrained steel colors, the existing metal panel asset with
nine-slice borders, and the local `prompt-control-v2.svg` bevel asset. Keep native
buttons, focus indicators, disabled states, and hotkeys. Gig choices reuse the
existing die renderer. Target-only prompts also receive the housing, even when
they contain no buttons. Tall prompts scroll inside the frame; compact landscape
uses a wider frame so Gig choices remain visible without making the prompt tall.

## Browser checks

Checked in the in-app browser at 1280x720:

- Visible hand discard stayed clickable with no modal covering the board; the
  compact banner showed the current instruction.
- Focused board integration passed, including click-to-discard target selection.
- The existing prevention-choice test continues to cover a multi-step modal
  that has no equivalent single board target.

This is representative surface coverage, not a full playthrough of every card
or every choice branch. In V2, spatial Gig choices resolve on the board lanes
rather than banner buttons; engine rules and action payloads remain unchanged.
