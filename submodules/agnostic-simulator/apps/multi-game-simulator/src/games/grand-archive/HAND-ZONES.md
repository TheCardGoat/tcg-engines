# Grand Archive hand zones

## Comparison with the existing games

| Surface | Layout | Visibility | Interaction |
| --- | --- | --- | --- |
| Cyberpunk `components/GameBoard/HandZone.tsx` + `handLayout.ts` | One component for both sides; measured width, upright player spread, smaller opponent arc. Mobile has a bounded horizontal scroller. | `opponent` controls layout; `faceDown` controls visibility separately. Hidden slots omit native card metadata. Only explicit temporary reveals show faces. | Board drag context uses shared pointer/touch/keyboard drag primitives and authoritative move selection. Mobile distinguishes horizontal scrolling from playing. |
| Flesh and Blood `FleshAndBloodTabletop.tsx` / `FabMobileBoard.tsx` | Shared simulator `HandZone` and `CardFan`, with compact shallow fans and hand-size-dependent overlap. | Viewer identity controls own metadata; public hand reveals are merged into otherwise hidden opponent cards. | Hand cards forward clicks into the interaction resolver. Shared fan cards are draggable; game action legality remains outside the layout. |
| Grand Archive `GrandArchiveBoard.tsx` + `board-renderer` | R3F hand fans use the shared scene-card and pose components. Cards and zones gives access to overflow. | Consume only viewer-authorized entities. Concealed counts generate anonymous backs without face textures. | Click or keyboard-select a card to inspect its legal actions; highlighted cards answer the shared draft. The scene background completes eligible optional selections. |

## Rules constraints

- **Game Zones – Hand**, General Rules 1–3: Hand is private, has no maximum size, and receives cards into their owner's Hand.
- **Public vs Private Information**, General Rules 1, 2, 6, 8–9: private cards have no characteristics by default; face-up exceptions remain public. The controlling player may examine their private Hand. Never infer opponent identity from remembered artwork, ordering, or a catalog lookup.
- **Card Activation**, General Rule 1, steps 1.4–1.9: modes and targets precede payment/activation. Dropping a card starts its current authoritative action; it does not shortcut intervening choices or place every card directly onto the Field.
- **Costs and Memory**, General Rules 1.1–1.4: reserve selection is changeable until commitment and must be clear. Selecting the final required card is the deliberate commitment gesture; incomplete selections can be deselected or cancelled. The engine moves reserved cards into Memory.
- **Costs and Memory**, General Rules 2.1–2.3: Memory-cost payments remain random and engine-owned. Hand selection must never replace random Memory payment.
- **Timing and Permissions**, Fast vs Slow 1–2 and Opportunity 2: drag eligibility comes from projected enabled actions, not turn ownership or printed cost.

Official sources: https://rules.gatcg.com/game-mechanics/game-mechanics-game-zones/game-zones-hand and https://rules.gatcg.com/game-mechanics/game-mechanics-playing-cards/playing-cards-costs-and-memory . Local mirror is under `submodules/grand-archive/.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/`.

## Direct interaction contract

- Drag only a viewer-authorized card with one enabled `activate-card` action. Mouse uses an 8px threshold; touch uses a short hold with movement tolerance so horizontal swipes keep scrolling. Keyboard drag uses the shared sensor.
- Drop into your Field to announce play. Wrong-area or cancelled drops return without starting a move. Legality is checked again at release. State-version or viewer changes remount the drag surface and discard its stale gesture.
- For spatial Hand payment/target/ordering choices, tap highlighted cards. Selected cards show an outline and sequence number. The final required card advances/submits through the shared validated draft, without a dialog or confirm button.
- Variable "up to" choices finish at the maximum, or by tapping empty Field after the minimum is satisfied. The same gesture explicitly chooses zero when allowed. Optional Hand choices defer the shared draft's initial default submission so the player gets to choose.
- The inline prompt gives the count and instruction. Mode, boolean, allocation, and multi-destination decisions continue through their existing authoritative controls; this layout does not invent an answer for them.
- Idle card taps still inspect the card and offer its legal actions. No all-zone cards-and-controls browser is restored.
