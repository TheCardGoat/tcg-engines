# Grand Archive simulator connections

Updated 11 October 2026. This inventory describes the local implementation; it is not a claim that every card, hosted infrastructure path, or future simulator feature has been certified.

## Active board

`GrandArchiveTabletop` mounts one `GrandArchiveBoard` for fixtures, practice, and hosted play. The board uses `board-renderer` (React Three Fiber) and the shared `@tcg/simulator-presentation/three` card, selection, and movement components. The Cambria themes supply illustrated table borders, resource rails, and corner environments; physical card frames and motion are rendered in the R3F scene. There is no alternate DOM board or renderer switch.

DOM overlays retain accessible card selection, named counters, native object/activation/keyword badges, player status badges, zone inspection, combat context, and the shared interaction prompt. Opening deal, card movement, targeting, and damage feedback use the shared presentation settings for motion and sound. Cards outside the scene's visible capacity remain available through each seat's zones menu. `grand-archive-theme.css` owns theme and overlay placement; scene composition owns camera and card geometry. See [board-renderer/README.md](./board-renderer/README.md).

## Action flow

`GrandArchiveTabletop` mounts one `GrandArchiveInteractionLayer` around both the board and sidebar. Hand, field, inspected pile, generic action menu, sidebar, and pass controls begin a canonical interaction draft. `GrandArchiveChoicePrompt` routes unordered card choices through the shared `SearchRetrievePrompt` (also used by Alpha Clash) and other inputs through `SharedInteractionPrompt`. Board targets, payments, retaliation and allocations use the shared draft and board handles. The final draft submits `InteractionSubmission` to practice's server engine or the hosted gateway. The older single-input projection is presentation metadata only; it is no longer an execution path.

Concede remains confirmed at the tabletop boundary. Read-only fixtures disable mutations while retaining card and zone inspection. Mobile sidebar-origin actions close the drawer to expose the shared prompt. Authoritative version changes clear drafts and duplicate-submission guards without resetting sidebar preferences. Rejected actions are reported over the board; an asynchronously rejected pregame request can be explicitly retried.

## Feature ownership and proof

| Feature                                                       | Rendering / integration owner                                                         | Focused evidence                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Hub, practice and fixture navigation                          | `Home.page`, `Fixtures.page`, routeRegistry                                           | `Navigation.test`, `fixtures.test`                                         |
| Deck setup, first/second, sideboarding                        | `GrandArchivePreparation`, `GrandArchivePreparation.page`, practice setup/preparation | `preparation.test`, `practice-setup.test`                                  |
| Pregame progression and optional choices                      | `GrandArchiveInteractionLayer`                                                        | `GrandArchiveHands.test`, `GrandArchiveConnectivity.test`, `Practice.test` |
| All structured action inputs                                  | Shared draft, `GrandArchiveChoicePrompt`, board controls and sidebar action menu                     | `GrandArchiveNativeChoices.test`; native fixture command tests       |
| Field and Memory                                              | `GrandArchiveBoard` and card browser                                                  | Direct selection, hidden-memory and zone tests                             |
| Material/Main decks, Graveyard, Banishment                    | R3F `SceneCard`, `GrandArchiveBoard` zone menus and shared card browser                                 | Authorized inspection and concealed-count tests                            |
| Revealed Main Deck information                                | Viewer-authorized entities in pile inspection                                         | `GrandArchiveConnectivity.test`; `zone-inspection` fixture                 |
| Pantheon                                                      | Populated seat-zone row; viewer-safe faces/counts                                     | Private Pantheon test in `GrandArchiveConnectivity.test`                   |
| Inner Lineage and Loaded                                      | Populated seat-zone rows; projected host labels                                       | `zone-inspection` fixture and `fixtures.test`                              |
| Intent and combat roles                                       | Intent row and projected card combat roles                                            | Combat and zone fixtures                                                   |
| Effects Stack                                                 | Central stack row plus shared response prompt                                         | Stack inspection/order/target tests                                        |
| History and printed card preview                              | `GrandArchiveSidebarActivity`, `GrandArchiveCardPreview`                              | `GrandArchiveTabletop.test`                                                |
| Bot pause/step/strategy/takeover                              | `Practice.page` and engine automation                                                 | `Practice.test`                                                            |
| Undo and session persistence                                  | Replay journal reconstruction                                                         | `practice-session.test`, `Practice.test`                                   |
| Hosted bootstrap, updates, rejection and next-game navigation | `LiveMatch.page`, gateway, session provider                                           | `LiveMatch.test`, `LiveMatch.page.test` (mock transport)                   |
| Online/offline presence                                       | Live seat projection → participant `connection`                                       | Live projection and real tabletop presence tests                           |
| Chat                                                          | Hosted gateway or local persisted practice messages                                   | Live page and practice tests                                               |
| End game                                                      | `GrandArchiveGameSummary`                                                             | Summary and practice tests                                                 |
| Desktop/mobile                                                | Shared viewport shell; mirrored seats                                                 | Local rendered inspection at 1280×1000 and 390×844                         |

## Active interaction and status components

`GrandArchiveBoard` stays mounted across actor changes. `GrandArchiveInteractionLayer` owns the draft provider, native submission, error handling and prompt placement. The board owns R3F geometry and accessible card/target handles. `GrandArchiveMaterializationPrompt` lists only visible cards with a current native action. Each chooser resolves through the server adapter; modal state does not resolve rules locally.

`GrandArchiveStatuses` displays effective object states, activation states and native keyword instances. `GrandArchivePlayerStatuses` displays public effective player states and mastery. `GrandArchiveCounters` retains named counters; unknown names retain a readable fallback. Their data comes from the native viewer projection, not printed-text inference. Hidden objects remain absent. Semantic Glimpse, partition, allocation and catalog-generation candidates receive resources only for the decision owner.

The shared presentation provider controls reduced motion and sound. The active scene owns the opening deal and card transitions; `GrandArchiveDamageFeedback` consumes authoritative visible damage changes. Rejected commands do not create feedback. Sound and motion settings persist at the simulator boundary.

Native fixtures begin before the player action and submit real card actions through the local server engine. See [the completion plan](../../../../../docs/grand-archive-ui-completion-plan.md) for the decision inventory, exact checks and browser evidence. Synthetic adapter tests are contract evidence only and are not playable fixture or real-card proof.

## Rules and privacy

All cards use shared card components. The adapter owns visibility; the UI never populates hidden slots using identities from other zones. Main Deck inspection lists only authorized reveals and does not claim their display order is deck order. Pantheon is private, including the opponent's Boons. Inner Lineage and Loaded cards are separate from Field; host labels come from the authoritative projection, not inferred ownership.

Rules mirror: “Game Zones — Public vs Private Information,” rules 3, 5, 6; “Game Zones — Pantheon,” rules 1–5; “Game Zones — Object-Specific Zones,” Inner Lineage and Loaded Cards; “Game Zones — Intent,” rules 1–3.

## Explicit product boundaries

These are absent capabilities, not unconnected buttons: a standalone replay viewer/fork route, spectator sessions, semantic game-outcome animation plans, and detailed post-game analytics. Replay journals already support restore and Undo. Adding the absent products requires their own contracts and implementation; this connectivity work does not imply that they now exist.

Real hosted multiplayer, network loss under production conditions, every card interaction, and exhaustive engine-rule correctness require further validation beyond simulator component tests and local browser proof.

The game-owned `stackView` supplies effect items in resolution order, an authoritative active item and next item, authored effect text, declared viewer-visible targets, and the current decision’s optionality. A top item awaiting Opportunity is not resolving. Optionality belongs to the active decision, not the entire card. Hidden target identities, private candidates, payment bindings, and tentative answers are excluded. `effectText: null` and `optionality: unavailable` represent missing authored text or unsupported decision metadata explicitly; the UI must not guess from printed card text.
