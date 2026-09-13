# Grand Archive simulator connectivity audit

Audited 8 September 2026 against the current local checkout, including the uncommitted stack, pregame, Field/Memory, and pile work. This is an audit of simulator wiring, not certification of every card implementation or a production deployment.

## Implementation follow-up

The eight confirmed wiring findings below have been addressed in the local implementation: canonical sidebar submissions, rejection display/retry, populated missing zones with viewer-safe inspection, field/material source actions, presence display, read-only fixture controls, authorized Main Deck reveals, and an updated blueprint. These findings are retained as the historical audit, not the current completion status. Pantheon is private; the original grouping of all missing zones as public was too broad.

Validation of the repair: the full GA suite passed (13 files, 73 tests); the final read-only/retry suite passed all 6 tests after its additional case. Adapter tests passed (19), and touched-file lint/type checks passed. Browser proof covers desktop/mobile zone inspection, authorized Main Deck reveals, and a sidebar-origin Evasive Maneuvers declaration: selecting the Champion target and Cram Session as reserve payment produced Memory 1 and Evasive Maneuvers as the next stack layer, with no visible error. Browser testing also caught and fixed a stale prompt-spacing selector that obstructed hand-card clicks.

The updated `BLUEPRINT.md` maps current features to owners and tests and preserves explicit product boundaries (replay viewer, spectators, semantic animations, analytics). Those are not claimed as implemented by the connectivity repair.

## Original verdict

The simulator is **partially connected**. The major components have consumers and practice has a functioning engine-to-board loop. However, not every projected feature reaches a usable interface, and two action systems have different capabilities. The existing [BLUEPRINT.md:13](../apps/multi-game-simulator/src/games/grand-archive/BLUEPRINT.md#L13) overstates coverage and should not be used as proof of completeness.

## Confirmed findings

### 1. High: sidebar action submission loses structured inputs

The adapter creates both a canonical interaction view and an older SimulatorInteraction representation. The latter reads only `action.inputs[0]`; boolean, number, allocation, and partition inputs become an input-free action. Sidebar Now renders that older representation with InteractionPanel. Both practice and hosted callbacks then build answers only for the first entity, ordering, or option input.

Consequently, a multi-input declaration or richer decision cannot be faithfully completed through this sidebar path. The main prompt supports those inputs, so the same engine action has different capabilities depending on where the player starts it. Engine validation remains authoritative; this is a UI submission gap, not permission to execute illegal moves.

Evidence: [projection.ts:78](../packages/grand-archive/grand-archive-server-adapter/src/projection.ts#L78); [GrandArchiveSidebarActivity.tsx:236](../apps/multi-game-simulator/src/games/grand-archive/GrandArchiveSidebarActivity.tsx#L236); [Practice.page.tsx:402](../apps/multi-game-simulator/src/games/grand-archive/Practice.page.tsx#L402); [LiveMatch.page.tsx:627](../apps/multi-game-simulator/src/games/grand-archive/LiveMatch.page.tsx#L627).

Recommended completion: make every action entry point call the same InteractionDraftProvider workflow, retaining one canonical submission path. Test the same target-plus-payment action from a hand card, field card, and sidebar, and verify equivalent complete submissions.

### 2. High: practice sidebar rejections are discarded

The protocol callback checks `result.success` and displays the rejection. The older callback ignores the returned result and unconditionally clears `botError`. A rejected sidebar action can therefore appear to do nothing, with no explanation. This amplifies finding 1.

Evidence: [Practice.page.tsx:402](../apps/multi-game-simulator/src/games/grand-archive/Practice.page.tsx#L402). Verify with a rejected submission and assert a visible error plus a usable retry path.

### 3. High: projected zones are missing from the persistent board

The adapter iterates all native zones. PlayerTable renders Field, Memory, Main Deck, Material Deck, Banishment, and Graveyard; Hands renders hands; the stack has its own panel. Combat renders intent only when the entity carries a combat role.

Pantheon, Inner Lineage, and Loaded have no dedicated persistent representation or normal inspection entry point. Intent has no independent zone outside the combat-role rendering. A legal decision may still expose cards through the choice modal, but that is not equivalent to being able to inspect the game state at any time.

Evidence: [projection.ts:457](../packages/grand-archive/grand-archive-server-adapter/src/projection.ts#L457); [GrandArchivePlayerTable.tsx:82](../apps/multi-game-simulator/src/games/grand-archive/GrandArchivePlayerTable.tsx#L82); [GrandArchiveCombatWorkspace.tsx:24](../apps/multi-game-simulator/src/games/grand-archive/GrandArchiveCombatWorkspace.tsx#L24). Browser DOM inspection confirmed the six current seat-zone types, mirrored for both players.

The rules mirror's “Game Zones — Public vs Private Information,” rules 3, 5, and 9, makes inspection of public cards and lineage relevant. Add zones or attachment/lineage groupings with shared card components, consuming viewer-authorized entities only. Do not turn hidden data into public information.

### 4. Medium: field and material cards do not expose their source actions directly

The enclosing CardContextMenuController receives actions only when the source belongs to the viewer's hand. Non-hand actions instead appear in “Board and material actions.” PlayerTable cards preview or select an existing target; they do not begin their own legal actions. Material Deck inspection likewise displays cards without offering their source actions.

These actions are reachable through the generic menu, so they are not dead engine features. They are disconnected from the most natural place to use them: the card itself.

Evidence: [GrandArchiveHands.tsx:74](../apps/multi-game-simulator/src/games/grand-archive/GrandArchiveHands.tsx#L74); [GrandArchiveHands.tsx:242](../apps/multi-game-simulator/src/games/grand-archive/GrandArchiveHands.tsx#L242); [GrandArchivePlayerTable.tsx:82](../apps/multi-game-simulator/src/games/grand-archive/GrandArchivePlayerTable.tsx#L82). Wire all viewer-authorized source actions into the shared controller, while preserving target-selection precedence and pile inspection.

### 5. Medium: presence is projected but not shown to the player

Hosted presence events update `seat.connectionStatus`. `toGrandArchiveParticipant` does not forward or render that value. The presence test checks the fixture passed to a mocked tabletop, rather than the actual participant display, so it does not catch the missing final connection.

Evidence: [LiveMatch.page.tsx:569](../apps/multi-game-simulator/src/games/grand-archive/LiveMatch.page.tsx#L569); [GrandArchiveTabletop.tsx:127](../apps/multi-game-simulator/src/games/grand-archive/GrandArchiveTabletop.tsx#L127); [LiveMatch.page.test.tsx:195](../apps/multi-game-simulator/src/games/grand-archive/LiveMatch.page.test.tsx#L195). Add a rendered online/offline indicator using the shared participant contract, with a real tabletop test.

### 6. Medium: fixture controls can look usable without a submit handler

FixturesPage mounts Tabletop without either submission callback. Hand actions correctly recognize the read-only board, but the sidebar Pass/Concede disabled conditions are based on available interactions, not submit capability. Tabletop supplies a wrapper callback regardless. A fixture can expose a clickable control that has no engine mutation behind it; Concede can even enter confirmation without a submission destination.

Evidence: [Fixtures.page.tsx:111](../apps/multi-game-simulator/src/games/grand-archive/Fixtures.page.tsx#L111); [GrandArchiveSidebarActivity.tsx:236](../apps/multi-game-simulator/src/games/grand-archive/GrandArchiveSidebarActivity.tsx#L236). Make read-only fixture behavior explicit and consistent, or provide an actual fixture runtime. Keep inspection available.

### 7. Medium: authorized Main Deck reveals have no ordinary inspection surface

The adapter preserves viewer-authorized revealed objects, including in private zones. The pile renderer nevertheless always feeds deck piles a synthetic back, and categorically excludes Main Deck from inspection. This is correct for the normal concealed deck, but lacks a surface for explicitly authorized revealed identities. The effect-choice modal may expose decision candidates; passive revealed information is not covered by that.

Evidence: [projection.ts:457](../packages/grand-archive/grand-archive-server-adapter/src/projection.ts#L457); [GrandArchivePlayerTable.tsx:233](../apps/multi-game-simulator/src/games/grand-archive/GrandArchivePlayerTable.tsx#L233). Design an authorized-reveal surface without implying unknown deck order or permitting free deck browsing.

### 8. Low: documentation describes features beyond the actual UI

[BLUEPRINT.md:13](../apps/multi-game-simulator/src/games/grand-archive/BLUEPRINT.md#L13) claims all zones are implemented and says sideboarding is not rendered. Current preparation code does implement sideboarding; several claimed board zones are absent. Those statements are now misleading in both directions.

Evidence: [BLUEPRINT.md:13](../apps/multi-game-simulator/src/games/grand-archive/BLUEPRINT.md#L13); [GrandArchivePreparation.page.tsx:54](../apps/multi-game-simulator/src/games/grand-archive/GrandArchivePreparation.page.tsx#L54). Replace completion claims with a maintained feature-to-route/component/test inventory.

## Feature inventory

| Feature                       | Current connection                                                | Qualification                                                                                    |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Hub and practice routes       | Registered and linked                                             | Practice, AI alias, fixture catalog, match landing, live match                                   |
| Deck setup and validation     | Setup → preparation → server engine                               | Catalog resolution and saved matchup tests exist                                                 |
| First/second and sideboarding | Preparation → match session endpoint                              | Hosted network behavior was inspected in code, not exercised against a real server in this audit |
| Engine pregame                | Empty actions auto-complete; meaningful choices use shared prompt | Asynchronous rejection/reconnect recovery needs additional proof                                 |
| Hand actions                  | Shared card controller → draft → protocol submission              | Structured target/payment tests exist                                                            |
| Field and Memory              | Viewer zones → shared CardFace → preview/selection                | Source actions remain in generic menu                                                            |
| Deck/pile zones               | Shared pile components and card renderer                          | Main Deck concealment; permitted pile inspection; reveal limitation above                        |
| Effects stack                 | Projection → ordered stack panel → inspection/targeting           | Passing uses authoritative interaction; UI does not resolve effects itself                       |
| Combat                        | Projected combat roles → Attack/Defend workspace                  | Field combatants are depicted again in the center; not a separate engine object                  |
| Decisions and payments        | Canonical view → shared prompt/choice modal                       | Sidebar legacy path is incomplete                                                                |
| History and card preview      | Viewer log → event log → shared preview                           | Current entities supply available references                                                     |
| Bot                           | Strategy → automatic/step executor → engine                       | Pause, takeover, release, and strategy controls are wired                                        |
| Undo and restore              | Replay journal → validated reconstruction                         | This is not a replay viewer                                                                      |
| Hosted match                  | Bootstrap/gateway → projection → tabletop → gateway submission    | Real hosted transport not end-to-end verified here                                               |
| Chat                          | Hosted gateway; local practice persisted messages                 | Local practice chat is local session content                                                     |
| End game                      | Winner state → summary → inspect/restart/menu                     | No detailed analytics                                                                            |
| Mobile                        | Shared viewport shell and activity drawer                         | Same underlying action-path issues apply                                                         |
| Fixtures                      | Nine routed deterministic states                                  | Read-only controls inconsistent; coverage is not exhaustive                                      |
| Replay viewer / replay fork   | No GA route registered                                            | Journal infrastructure exists; a player replay UI does not                                       |
| Spectating                    | Explicitly unavailable in live page                               | Intentional boundary, not an accidentally hidden button                                          |
| Semantic animations           | No GA animation plan published                                    | Shared visual primitives alone do not provide game-outcome animation coverage                    |

## Unused-code assessment

A source-reference inventory found consumers for all exported GA React components. No whole GA component was established as an unreferenced orphan. This is not a bundle-level dead-code or CSS selector audit. Unused _data and capabilities_ are the stronger finding: unrendered zones, dropped presence, and loss of interaction input information.

## Completion order and acceptance criteria

1. Unify action initiation and submission; show rejections at the active prompt, including sidebar-origin actions.
2. Put source actions on field/material cards and prove equivalent submissions from every entry point.
3. Add remaining public zones, lineage/loaded relationships, and authorized reveal inspection.
4. Wire presence and explicit read-only fixture behavior.
5. Refresh the blueprint and extend fixtures for the missing states.

For each feature, require an engine state, viewer-safe projection, reachable rendering, correct click/keyboard behavior, accepted authoritative submission where applicable, and a visible resulting state or rejection. A component import or mocked projection test alone is insufficient.

## Validation and limits

Read route registration, component composition, both action paths, preparation, practice, live transport, adapter zone/input projection, and existing tests. Inspected the running local practice UI and its rendered zone inventory. No product implementation was changed by this audit. No deployment, real multiplayer match, exhaustive card-catalog validation, or exhaustive rules-engine audit was performed.

GA-focused suite: `vp test run --configLoader runner src/games/grand-archive` — **12 files, 65 tests passed** (87.27 seconds). No implementation changes or broad CI checks were needed for this audit. Passing tests do not establish coverage of the identified missing connections.
