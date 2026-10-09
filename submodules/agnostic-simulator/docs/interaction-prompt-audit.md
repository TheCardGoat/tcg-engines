# Interaction prompt audit — 2026-10-06

## Result and scope

The intended boundary is correct for the shared protocol games:

`native engine state/choices → game adapter → EngineInteractionView → React draft + DOM prompt + board hit targets → InteractionSubmission → adapter → native command`

Three.js renders the board. React DOM can retain prompts, drawers, search, numeric controls, focus handling, and accessible buttons. The board and prompt must share one draft and submission path. Animation state must not become game state.

This is a source audit of the nine game slugs, plus a synthetic post-adapter component inventory. It is not a card-by-card rules audit or a hosted-match certification. Disney Lorcana is one game. The `platform` protocol slug is not another game. Concurrent engine, motion, audio, and opening-scene work was present during this audit and was preserved.

Open `/component-catalog` → **Interaction test inventory**, or `/simulator-ui-fixtures/interactions`. Each case has a separate URL under that route. Existing `/simulator-ui-fixtures/interaction-prompt?state=...` previews remain available. No Storybook additions are used.

## Three distinct contracts

| Contract | Owner | Meaning |
| --- | --- | --- |
| `EngineInteractionView` / `InteractionSubmission` | `packages/protocol/src/interactions.ts` | Versioned legal actions, typed input bounds, candidates, resolution context, and validated answers. Preferred shared interaction boundary. |
| `SimulatorInteraction` / `HarnessFixture` | `packages/simulator-contract/src/index.ts` | Presentation harness model. Input kinds: action, single-target, multi-target, option, ordering, payment, drag-drop-target. This is not a lossless replacement for the protocol. |
| `PlayerInteractionView` | `../lorcana/packages/lorcana/lorcana-interaction/src/types/player-interaction-view.ts` | Lorcana's own interaction model, consumed by its Svelte simulator. A shared protocol bridge is still needed for the proposed shared React renderer. |

The server engine interface makes `getInteractionView` optional (`packages/shared/src/game-engine/types.ts`). Having a registered adapter does not prove that it emits the shared prompt model. Lorcana's server adapter wraps native dispatch and viewer state but does not implement that method. Riftbound's server engine uses manual tabletop actions and also lacks that projection.

## Shared protocol inventory

| Input kind | Required preview states | New page IDs |
| --- | --- | --- |
| `entity-selection` | One/many, zero/optional, empty, disabled, player, cost, board versus drawer | single-target, multi-target, optional-target, empty-target, disabled-target, player-target, payment, spatial-target |
| `option-selection` | One/many, disabled option, searchable options | options, multi-option, search |
| `boolean` | Accept and decline; false is a valid value | boolean |
| `number` | Zero, min/max, integer step | number |
| `ordering` | Complete ordered sequence | ordering |
| `entity-partition` | Exhaustive routes, automatic remainder, bottom-first direct order | partition, automatic-remainder, direct-order |
| `entity-allocation` | Per-entity bounds and exact aggregate | allocation |
| No input / composed / host | Ready action, conditional amount, queue progress, observer, idle, waiting, game over, projection failure | ready-action, conditional, queue, observer, idle, waiting, game-over, projection-failure |

The catalog contains 30 cases. Fixtures validate with the protocol schema. Each actionable case has a known valid answer and a stale-state rejection check. The game slug on these synthetic samples is only protocol metadata; the samples do not call a native engine. The spatial case uses real R3F meshes plus equivalent accessible DOM buttons. It validates immediate singleton submission. It does not exercise a production game board, animation lock, camera overlap, or asset loading.

The protocol also has 13 intents: play-card, resource-card, attack, activate, move-card, pass, undo, concede, mulligan, choose-option, choose-targets, order-cards, custom. Intents label actions; they do not add input widget types. Payment is usually entity selection with role `cost`. Non-card entity kinds include player, zone, resource, die, and effect.

## Per-game inventory and source paths

Paths in this section are relative to `submodules/agnostic-simulator` unless they begin `../`.

### Disney Lorcana

Native prompt families in `../lorcana/packages/lorcana/lorcana-interaction/src/build-player-interaction-view.ts`:

- `target-selection`, `discard-choice`: card/player targets, bounded selection and decline.
- `choice-selection`: named choice.
- `optional-selection`: accept or decline.
- `name-card-selection`: card name search/choice.
- `scry-selection`: place cards across destinations, with eligibility and order.
- Action interactions also cover play, ink, quest, challenge, sing/shift choices, location movement, abilities, mulligan, and turn controls.

Renderer evidence: `../lorcana/packages/lorcana/lorcana-simulator/src/lib/features/simulator/context/game-context.svelte.ts` calls `buildPlayerInteractionView`; `board/ResolutionTargetOverlay.svelte` consumes candidate interactions. Server boundary: `../lorcana/packages/lorcana/lorcana-server-adapter/src/lorcana-server-engine.ts`.

**Gap:** the new shared samples describe suitable target shapes, but do not prove a Lorcana mapping. Preserve its source/target distinction, optional decline, search catalog, singing costs, and scry destinations when adding that bridge.

### Cyberpunk

Source: `packages/cyberpunk/cyberpunk-server-adapter/src/interaction-protocol.ts`.

| Native choice | Current mapping / concern |
| --- | --- |
| scry | Destination option plus eligible card selection; remainder/order context also lives in text params. Not the shared partition widget. |
| revealDestination | Destination options and revealed-card context. |
| chooseTarget | Entity selection; discard and optional branches; some direct option presentation. |
| chooseTrigger | Option selection; source/trigger context. |
| chooseGigsToSteal | Bounded gig selection. |
| chooseCardToPlay | Card selection and optional boolean where applicable. |
| chooseCardToMove | Card selection, source/destination context, optional boolean. |
| chooseCardType | Option selection. |
| gainGig | Game-specific gig controls. |
| chooseEffect | Option selection with effect source. |
| redirectDefeat | Replacement target selection. |
| chooseSacrificialGear | Gear selection. |
| preventGigSteal | Game-specific prevention/payment decision. |
| chooseFirstPlayer | Player selection. |

Additional move procedures: none, selectCard, selectPair, selectAbility, playCard. Numeric gig adjustment has bounded number and optional-boolean inputs. Combat includes attack unit/rival, blocker, resolve attack, and priority. Setup includes mulligan. Payment and RAM distribution have separate presentation data; `ram-distribution.ts` is not evidence that Cyberpunk emits `entity-allocation`.

Renderer: `apps/multi-game-simulator/src/games/cyberpunk/components/BoardV2/CyberpunkBoardV2.tsx` mounts `CyberpunkInteractionPanel`, which mounts custom `Prompt/ChoiceModal.tsx` and `PaymentSelection/PaymentSelectionPrompt.tsx` through game UI. The hidden adapter/debug panel uses `InteractionPanel`; it is not the visible game prompt.

**Gap:** shared prompt previews cannot certify these custom branches. Port their labels, private candidate imagery, payment selection, cancel/restore, combat target hit areas, and submission conversions explicitly.

### Gundam

Source: `packages/gundam/gundam-server-adapter/src/interaction-protocol.ts`.

| Native choice or step | Current shared input |
| --- | --- |
| targetSelection | Entity selection; some remainder flows become partition; optional boolean when needed. |
| optional | Boolean. |
| chooseOne | Option selection. |
| ordering | Option selection for the offered effect order; do not assume card ordering. |
| deckLook | Entity partition with extraction/destination routes, eligibility and order. |
| selectCost | Entity selection of resources with role cost. |
| selectMode | Option selection, including conditional requirements. |
| selectTarget | Entity selection with move-specific binding/role. |
| confirm | No input. |

Pending effect identity is an implicit option input. Setup includes choose first player and mulligan; combat and actions include pilot pairing, attacker/defender, blocker, priority/pass.

Renderer: `apps/multi-game-simulator/src/games/gundam/src/components/containers/PromptContainer.tsx` uses `InteractionResolutionPrompt` and `game/interaction-draft.tsx`. Setup uses `SetupPromptContainer.tsx`, `ChooseFirstPlayerPrompt.tsx`, and `MulliganPrompt.tsx`. Attack controls also use `components/attack-interactions.ts`. `GundamPendingChoicePrompt.tsx` exists, but its presence alone does not prove it is mounted; the audit does not treat it as the primary renderer.

**Gap:** shared controls exist, but production board entity IDs, card rendering, scroll restoration, implicit effect IDs, target roles, and conditional modes must be preserved in the new board.

### Other supported games

| Game | Native families / actions | Source |
| --- | --- | --- |
| Flesh and Blood | boolean, option, entity-target, ordering, numeric, partition, payment, effect-resolution, group-choice; play, activate, defend, pass/end turn | `packages/flesh-and-blood/flesh-and-blood-server-adapter/src/interaction.ts` |
| One Piece | chooseOption, selectEntity, confirm, payCost, orderItems, chooseAction; play, attach DON, attack, activate, end turn, mulligan, first player, Jo Ken Po | `packages/one-piece/one-piece-server-adapter/src/interaction-protocol.ts` |
| Grand Archive | replacement, unique object, preserve destination, retaliators, retaliation damage order, critical, effect attack, delegated defender, influence discard, recollection, trigger/order, optional/choice/payment, retarget/remode, level up, direction, distribution, move partition, counter allocation, effect materialization/activation, glimpse | `packages/grand-archive/grand-archive-server-adapter/src/interaction.ts` |
| Naruto | mulligan, summon, set/activate support, activate support from hand, character/leader effect, recovery, attack, pass counter, resolve choice, end turn; emitted inputs are boolean and entity selection | `packages/naruto/naruto-server-adapter/src/interaction.ts` |
| Alpha Clash | option→boolean, modal→options, target→selection, count→number, division→allocation; play/respond/set, activate, weapon attachment, clash, obstructors, resource, mulligan, passes | `packages/alpha-clash/alpha-clash-server-adapter/src/interaction-protocol.ts` |
| Riftbound | Manual tabletop reducer, state projection and direct actions; no shared prompt projection found | `packages/riftbound/riftbound-server-adapter/src/engine.ts` |

Grand Archive has a separate Three board and `GrandArchiveInteractionLayer.tsx` using the shared prompt. FAB uses the shared prompt in `FleshAndBloodTabletop.tsx`. This does not establish that all games share a single 3D renderer.

## Migration acceptance requirements

1. Capture an actor-safe native adapter result for each game family, including hidden-zone and observer cases. Synthetic shared samples remain useful but must not be reported as adapter round trips.
2. Preserve stateVersion, requestId, actionId, instance IDs, definition IDs, roles, source identity, conditional requirements and implicit inputs. Reject stale submissions and clear stale drafts on a new request.
3. Use one draft for raycast clicks, drag/drop, accessible DOM buttons, drawer choices and payment. Test each native submission converter through a public engine action.
4. Keep effects and resource/target bounds authoritative in the engine. Do not derive legality from meshes, animations or card text in the renderer.
5. Test queue step changes, request replacement, disabled actions/candidates, zero/false/empty answers, maximum selection, partition uniqueness, ordered remainders, and allocation totals.
6. Verify keyboard focus, Escape/cancel, touch, portrait/landscape, private-card labels and inspection, observer privacy, reconnect, projection failure and game over.
7. Test animation suppression and input restoration with the motion agent's final shared presentation API. No audio or motion implementation was changed by this audit.

## Validation

- Owner-local inventory/schema/submission and component-catalog checks pass (33 tests).
- Browser: inventory loaded; R3F mesh click submitted a valid singleton; allocation controls enforced total 3 and submitted 2+1; optional amount declined with a valid submission.
- Browser: search filtered options and submitted; ordered selection preserved gamma/alpha/beta; mobile partition assigned all cards, reordered the bottom route and submitted. Optional amount accept and decline passed at 390×844. The partition preview now reserves enough height for its card row.
- Lint passed for added production modules. Full app TypeScript validation reports errors in other files; no errors remain in the added modules after fixing the test options. Hosted native game round trips and complete 3D game migrations remain unverified.

## Shared interaction UI implementation

Grand Archive now uses `InteractionDraftPrompt` for its prompt bindings while retaining its existing card presentation and R3F target selection. Alpha Clash practice and live match pages now use the shared workspace, menu, and prompt instead of separate input forms. Its live board uses the same draft through the board bridge. This change does not replace Alpha Clash's existing board renderer.

Reusable exports from `@tcg/simulator-ui`:

- `InteractionWorkspace`: accepts the adapter's `EngineInteractionView`, viewer ID, disabled state, and submission callback. Owns one draft and starts an unambiguous pending decision. The host passes transport or animation locks through `disabled`.
- `InteractionActionMenu`: renders protocol action labels, availability, waiting and failure states.
- `InteractionDraftPrompt`: binds all seven existing shared input widgets to that draft. Games can supply candidate presentation and prompt options.
- `useInteractionBoard`: supplies candidate IDs, selected IDs and selection callbacks to a DOM or Three.js board. IDs remain protocol instance IDs.

A submission callback returns true only when dispatch is accepted. Hosted adapters must validate against the latest view. Rules, hidden information, and candidate legality stay in the engine/adapter. Alpha Clash candidate labels are resolved only from its viewer-safe projection. A request replacement now clears the old draft without erasing a newly opened draft that reuses the same action ID.

Native test pages are linked from the existing inventory:

- `/simulator-ui-fixtures/game-interactions/grand-archive`: native attack fixture and R3F board.
- `/simulator-ui-fixtures/game-interactions/alpha-clash?mode=self`: native local practice with both seats.

Validation: 84 app tests and 65 shared draft/prompt tests passed. This includes protocol-shaped Alpha Clash, Grand Archive and Cyberpunk decisions, request replacement, disabled input, allocation totals, and existing Grand Archive interaction checks. In the browser, Grand Archive selected an opposing card on the 3D board, selected its defending player, and submitted the attack. Alpha Clash started, deployed a resource, and played Sonoro through the native engine. Resource selection also passed at 390 by 844 pixels. Hosted multiplayer transport was not exercised. Full app type checking still reports errors outside the changed files. Cyberpunk production UI has not been migrated by this change.

## Visual review pass — shared prompts

The 26 inventory states were visually inspected at 390×844. Desktop checks at 1265×712 covered boolean, numeric, option selection, allocation, partition, direct ordering, search, and player targeting. The payment candidate dialog and a valid 2+1 allocation submission were exercised on mobile.

Changes from this review:

- Compact desktop prompts now have a 48rem maximum width instead of 66rem, preserving more board space.
- Allocation has a visible assigned total, remaining requirement, per-candidate limits, aligned 44px counters, and a centered numeric output. Candidate rows reflow on narrow screens.
- Mobile instructions wrap in full instead of stopping after two lines.
- Candidate hover/disabled treatment and the choice dialog border use the shared theme tokens. Observer text is larger and uses the host surface color.
- Player and non-card target browsers no longer use the generic card label. The player fixture also uses the correct instruction.
- The spatial fixture's accessible buttons wrap on narrow screens.
- Grand Archive's native side prompt retained its board-safe position, with larger 14px desktop and 12px mobile instructions. Native attack selection was checked at both sizes.

Remaining visual acceptance work: inspect the complete native decision families in each game, long translated labels, populated ordering/card-art layouts, landscape, keyboard traversal, and the final motion/input-lock integration. The shared fixture pass does not certify those production paths. The broader visual goal remains open.

## Native and landscape review pass

Added the existing native Grand Archive materialization engine fixture to the inventory at `/simulator-ui-fixtures/game-interactions/grand-archive?scenario=materialization-hand`. Materializing Ornamental Greatsword through the visible card browser reached the native effects stack.

This exposed a narrow mobile stack prompt containing the entire rules paragraph. The normal prompt now leads with Opportunity/response guidance; Show details retains the complete rules in a wider, opaque inspection panel. The expanded panel was checked at 390×844 and 844×390. Informational stack prompts no longer inherit a Cancel action from the shared draft wrapper; the wrapper now has an explicit `cancellable` option.

The 844×390 partition preview exposed a second defect: the landscape breakpoint stopped at 640px, so cards were hidden in a short vertical scroll region. The shared short-landscape layout now applies through 1024px, with horizontally scrollable card choices alongside destination counts and confirmation. All three cards were assigned, the bottom-deck order was changed, and the submitted partition validated. Search and allocation were also visually checked in landscape. The payment dialog was opened with Enter; Shift+Tab wrapped inside the dialog and Escape restored focus to its trigger.

Validation: 83 focused app tests passed, including native Grand Archive hand/tabletop tests, inventory checks, and the new non-cancellable informational prompt regression. Lint and scoped whitespace checks passed. The existing immediate-rules-text test now verifies response guidance first and full rules through Show details. The wider cross-game visual acceptance remains open; this pass does not establish all native decision families or hosted multiplayer coverage.


## Real-card, long-list, and optional-choice review

The Grand Archive inventory now has a scenario selector for native attack/materialization and projected recollection, retaliation, stack response, and observer cases. Projection previews use existing viewer-safe engine projections and validate submissions without advancing an engine; the page states this distinction.

- Recollection: the candidate thumbnail loaded, but the full-card preview did not. The DOM thumbnail and large preview requested the same asset in different CORS modes. Removing the unnecessary anonymous mode from the DOM choice configuration made both images load. Three.js texture loading is unchanged. Verified both images at natural width 500, and selected the card with Enter.
- Retaliation: the new preview exposed automatic submission of an omitted optional target. `InteractionDraftProvider.begin` now requires active choices to have explicit, complete values before using its immediate-submit path. A legal omitted answer no longer counts as a player decision. Browser proof now shows the zero-of-one prompt until Choose none is clicked. Regression tests cover Alpha Clash, Grand Archive, and Cyberpunk-shaped views.
- Observer: the public prompt says the opponent is choosing, with no private candidate browser.
- Added `search-many` (40 options) and `dense-candidates` (18 candidates) to the shared inventory. At 390×844, long text wrapped, unavailable candidates remained disabled, empty search feedback appeared, and option 32 was found and submitted with the keyboard. Selecting cards 2 and 18 across a scrolling list also produced a valid submission.
- The shared image-choice dialog clipped its full-card preview in landscape. Its short-landscape layout now sizes the preview within the available height and preserves the full artwork. Verified at 844×390 and 667×375.

Focused validation passed: 77 shared draft/prompt/dialog tests and 115 app tests. The dialog tests were repeated after the landscape CSS change. Full app type checking remains affected by unrelated existing diagnostics; no diagnostics were reported for this pass's files. Remaining review includes the Alpha Clash embedded prompt layout, other native game decision families, theme consistency, and final motion-lock integration.

## Embedded panel review

Added an explicit `embedded` presentation to the shared prompt. It follows normal document flow, adapts controls to container width, and omits board drag/placement controls and modal semantics. Alpha Clash uses it below its action menu, replacing a fixed 520px spacer. Every shared inventory case now has a narrow-panel link (`?layout=panel`). Destination cards scroll horizontally within a narrow panel while the panel itself grows with its contents.

Browser proof: at desktop width, Alpha Clash started a native local match, opened the embedded resource prompt, selected Astonishing Colossus through the shared picker, and advanced to Primary Phase with one ready resource. The 350px numeric and allocation previews fit their controls. Numeric submission validated. At 390×844, the embedded destination preview displayed route buttons and accepted a valid partition submission.

Validation: 77 shared tests and 115 app tests passed; the new embedded-preview test then passed with the existing two catalog UI tests. It verifies normal region semantics, absence of board-placement controls, and valid submission. Remaining broader acceptance work includes other native decision families, theme consistency, and final motion-lock integration.

## Input suspension and artwork ordering review

The shared input-lock review found a real gap: destination route controls remained available when the host disabled the workspace, and an already-open picker could remain mounted. Instruction-only/access-suspended prompts now close the picker, hide destination inputs and Browse choices, defer numeric initialization, and release modal focus handling. Embedded destination panels no longer trap keyboard focus. The shared wrapper also suppresses cancellation when access is disabled. New regression tests cover locking an open picker, unlocking it without reopening automatically, and locking a destination prompt.

Every inventory page now has Pause input/Resume input controls. In the browser, a populated destination answer survived pause/resume and submitted successfully. This validates host suspension semantics; it does not establish every game's animation integration.

Added real-art destination and ordering pages (`art-partition`, `art-order`), bringing the shared inventory to 30 cases. They use the existing pinned Grand Archive art catalog in explicitly synthetic protocol scenarios. The review exposed reorder controls covering the bottom of card art. Controls now occupy a separate row with 44px height; the art area can shrink while preserving aspect ratio, and short landscape gets sufficient prompt height. Verified full artwork and controls at desktop, 390×844, and 844×390. A keyboard reorder on mobile changed Spirit of Fire to position 2 and submitted a valid bottom-deck order. Real-art destination controls also fit the 350px panel.

Validation: 77 shared draft/prompt/dialog tests and 120 app tests passed. Scoped lint and whitespace checks passed. Full type checking still has unrelated existing errors; three test-only role-query typing errors introduced during this pass were corrected. Remaining acceptance work: other native decision families, host theme consistency, and each production motion/input-lock integration.

## Host theme review

Every shared inventory page now has a light/dark theme control using the existing simulator theme tokens. The browser review found that body-portalled choice dialogs and prompt menus lost the host surface's colors. The prompt now captures its resolved presentation tokens when either popup opens and supplies them to the portal. This preserves custom host colors without changing engine data or game-specific renderers.

Selection counts, destination totals, and accent icons now blend with the host text color instead of using a low-contrast bright accent alone. Selected destination buttons and option checks use dark ink on the bright accent, matching the primary action.

Browser evidence: the light-theme picker and utility menu matched the white host prompt; a card selection submitted successfully. At 390×844, a 2+1 allocation showed readable counters and state feedback and submitted successfully. Real-art selected destinations were inspected in the 350px light panel. The dark theme remains available for comparison in the same page.

Validation: 47 focused app tests and 67 shared prompt/dialog tests passed, including a regression proving that the portalled choice browser retains host surface and text colors. Scoped lint and whitespace checks passed. Game-specific image modals and complete native decision families still need their own host checks; this pass does not claim full production motion integration.

## Additional Grand Archive states and target identity

The native-game selector now exposes five more existing adapter projections: pregame actions, materialization choices, Opportunity, automatic resolution, and game over. The empty pregame fixture automatically completes its inputless step, as required by the existing native UI test. Materialization skip validated in the browser. Automatic resolution offered no invented gameplay choice, and the terminal projection disabled Concede.

The mobile Opportunity review found two presentation defects in the target-to-payment flow:

- Identical champions had identical artwork without visible ownership. The shared picker now accepts an optional viewer-safe `candidateCaption` callback. Grand Archive supplies You/Opponent plus the public card title. Captions are visible and serve as accessible button labels; duplicate captions receive copy numbers.
- After selecting a target, reserve payment still used generic spatial target wording. Spatial cost selections now use the adapter's instruction and the card selection noun, so this action says Choose reserve payment sources.

At 390×844, the picker showed both ownership labels, the opponent's champion was selected, and CookTech Knife was selected for the next payment step. The adapter preview accepted the resulting submission. It does not advance the engine. The native UI regression follows this same public control sequence and checks that the opponent instance is included in the submission.

Validation: 55 shared prompt tests passed. The 57 existing Grand Archive hand/control tests passed; the new owner-caption/payment regression passed after correcting its punctuation expectation to match the UI's existing sentence normalization. Scoped formatting, lint, and whitespace checks passed. Full app type checking still reports unrelated existing diagnostics; no diagnostics matched the files changed in this pass.

## Shared runtime input boundary

A runtime-context regression confirmed a mismatch: `InteractionResolutionPrompt` hid during an active transition, but `InteractionActionMenu` and `useInteractionBoard` still accepted input. `InteractionWorkspace` now includes the optional animation runtime's active transition in its access decision. Menu, board targets, pending-decision initialization, and submission therefore share the same lock through preparation and playback. Hosts without that provider retain their existing behavior and can still pass an explicit disabled state.

Added `/simulator-ui-fixtures/interactions/motion-lock` to the inventory. It uses `createSimulatorAnimationScope` and an eight-second hold, not a simulated boolean lock. Browser proof showed disabled menu/board controls and no prompt during playback; natural completion restored them and the next board target validated. Explicitly finishing the transition also restored the controls. The page states that it validates input gating, not game motion artwork or native dispatch.

Validation: 67 shared workspace/draft/prompt tests passed, including new preparation/playback regressions. Formatting and scoped lint passed. The broader completion audit still lacks browser evidence for Alpha Clash's native pending-choice families beyond resource/play actions and for host-specific motion scopes; these must not be inferred from the shared runtime test.

## Alpha Clash native choice previews and completion

The Alpha Clash inventory selector now includes all five native pending-choice kinds: optional effect, modal effect, target, count, and division. Typed sample choices are injected into an engine-generated viewer-safe projection, then passed through `buildAlphaClashInteractionView`. The page uses the same shared workspace and embedded panel as practice/live match. It validates each answer and shows the result of `alphaClashSubmissionToPayload`. These are adapter previews, not card-effect engine dispatch tests.

This check exposed an adapter defect: shared single-option/target choices use arrays, while the native command converter only read scalar selections. The converter now extracts the selected identifier from either form. Public-control regressions cover decline, zero, modal selection, target selection, and exact damage allocation.

Browser evidence: decline produced `optionId: no`; Recover health produced `optionId: recover`; the opponent target produced its instance ID; an explicit zero produced `optionId: 0`; at 390×844, a 2+1 allocation produced the two correct native amounts. The narrow embedded prompt displayed complete labels and usable controls. Five new UI tests and all 19 Alpha Clash adapter tests passed. Scoped lint passed. App-wide type checking still reports existing errors outside these changes.

The requested delivery is complete: a nine-game source audit, 30 shared protocol inventory cases, a real runtime-lock test page, Grand Archive and Alpha Clash shared UI integration, and native game preview selectors. Desktop, mobile, short landscape, keyboard, light/dark, and narrow-panel evidence is recorded above. Earlier remaining-work statements describe the state at each pass; this section records the final scope.

Limits: this does not certify every card or hosted multiplayer. Game-specific motion artwork and host animation scopes remain with the motion work. Cyberpunk and other consumers can reuse these controls but have not all been migrated. Lorcana still needs a shared interaction bridge; Riftbound still needs a shared prompt projection. Engine rules and Alpha Clash board rendering were not redesigned.

## Grand Archive inventory page — 2026-10-07

The Grand Archive game-interactions root now opens a dedicated inventory. It reads all 18 existing native visual fixtures from the same registry as the game fixture pages. Scenarios are grouped by combat, turn flow, player decisions, and terminal state, with search, a playable/projection filter, direct links, and a shared-input summary. Two fixtures advance a local engine; the other 16 are fixed projection previews, including inspection states. This extends access to existing fixtures; it does not claim 18 new engine situations.

Every scenario has an inventory return link and a searchable scenario selector. Projection previews now expose the submitted protocol answer in a disclosure; Reset clears the result and restores the prompt. Browser checks passed at desktop and 390×844: search, playable-only filtering, empty search feedback, opening retaliation, submitting an empty retaliation selection, inspecting the actual protocol payload, and resetting. Existing game controls and the shared UI are reused.
