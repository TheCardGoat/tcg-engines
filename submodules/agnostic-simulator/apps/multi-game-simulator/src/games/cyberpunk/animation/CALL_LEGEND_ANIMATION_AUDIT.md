# Call a Legend animation audit

## Rules and state contract

Calling a Legend is one visible transaction with several possible state changes:

1. Validate timing, the once-per-turn limit, the 1 Eddie cost, and the selected face-down Legend.
2. Pay the cost. Payment can spend an Eddie card, a different ready Legend, or the Legend being called. Some effects make the Call free.
3. Turn the selected Legend face-up in its existing Legend slot.
4. Preserve its orientation unless that Legend paid the cost. A ready self-paying Legend finishes spent; an already-spent Legend stays spent.
5. Resolve `CALL` effects after the reveal. These can add later transfers, reveals, prompts, or other state changes.

The reveal does not move the card. Gear attached beneath the Legend stays attached because the host remains in the Legend area. The Gear remains anchored and visible while only the host card face is replaced by the Three.js transition.

## Event and animation sequence

The engine emits payment events before `legendFlipped` and `legendCalled`. The animation builder converts the selected Legend's combined face and orientation delta into one `legendReveal` step. It suppresses a simultaneous `cardSpent` step for the same entity so two clones cannot compete for the same card.

The adapter projects `legendReveal` as a face state change with explicit start and end rotations. The browser runs that state change for 460 ms. The Three.js clone flips between back and front at the board slot while the source host face is hidden. Attached Gear siblings remain in the DOM. CALL-trigger consequences start after the reveal cursor.

## Cases covered

| Case                        | Expected visible result                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Eddie pool/card pays        | Eddie resource spends while the Legend flips in place at its existing orientation.                   |
| Called Legend pays          | One combined face-and-orientation transition, ready to spent (`0` to `90` degrees).                  |
| Different Legend pays       | Paying Legend spends and selected Legend flips; each entity owns one transition.                     |
| Called Legend already spent | Face transition stays at `90` degrees throughout.                                                    |
| Free Call                   | No payment transition; reveal and CALL consequences still run.                                       |
| Call during react timing    | Same visual contract; only legality and once-per-rival-turn tracking differ.                         |
| Legend has attached Gear    | Host flips while each Gear remains attached, visible, and anchored beneath it.                       |
| Legend has a CALL ability   | Consequences follow the face reveal; public cards transferred from the deck use their front artwork. |

## Bugs found during the audit

- Attached Gear shares the host's zone storage. The Eddie helper accepted any face-down card in `legendArea`, so it could spend Gear instead of the Legend. `legendCanPayEddie` now requires an actual Legend definition.
- Self-payment previously produced overlapping `cardSpent` and `legendReveal` clones. The builder now coalesces them.
- `legendReveal` previously omitted orientation and could briefly make a spent Legend upright. It now carries explicit rotations.
- The state-change layer previously hid the entire registered Legend node, including attached Gear. Face changes now hide only the marked host face.
- Hover preview could remain over the board during the Call. Animation start now dismisses it.

## Regression fixtures

- `legendCallEquippedSelfPay`: face-down ready Royce, two attached Gear, and no Eddie pool. Calling Royce must finish face-up and spent with both Gear still attached.
- `legendVStreetkid`: validates the reveal followed by V's three-card mill and the later target prompt.
- Engine tests cover ordinary payment, free/insufficient payment boundaries, self-payment, already-spent orientation, and attached Gear exclusion.
