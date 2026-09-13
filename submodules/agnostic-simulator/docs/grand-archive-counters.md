# Grand Archive counter identity

The GA card wrapper renders damage and counters over card imagery, including mini cards, instead of relying on the shared text-only stat grid. Icons, values and distinct damage coloring keep the board readable without relying on color alone.

## Implemented presentation

- Damage remains at the bottom of the counter dock. A clock distinguishes ally damage, which clears in the end phase, from persistent champion damage.
- Buff and debuff use plus/minus circles; Bulwark a shield; Durability a hammer; Enlighten a sun; Level a chevron; Omen an eye; Static a bolt; Wither a leaf; Preparation a bookmark. These are simulator symbols, not official game iconography.
- Arbitrary named counters retain their public name and use a tag symbol.
- Two counter kinds remain visible; a count of additional kinds opens the complete list. The inspection target is at least 44px. Opening it never executes the card action.
- During target selection, selected-card prompts, and non-button candidate rendering, one primary counter stays visible (damage first) so values cannot overlap and the entire card remains available for selection. All counter descriptions remain in the accessible card name.
- Shared numeric stats remain available for detail views and missing-art fallback cards, with the same concealment and zero-value filtering as the decorations.
- The inspector supports click, keyboard, Escape and focus return, with viewport-aware placement. Resting the card does not rotate its counter dock.
- Zero secondary counters disappear. Explicit zero durability remains visible. Damage is taken only from `object.damage`, even when a legacy counter map also contains a damage entry.
- The adapter redacts decorations and the damage-lifetime hint for concealed identities. The component additionally suppresses counters on hidden card faces.
- An object incarnation change remounts inspection, preventing a zone transition from retaining an old popup. Count updates use the current projection. Removing a focused inspector returns focus to the surviving card control.

The existing top combat-role lane remains separate. The normalized decoration contract stays game-agnostic; counter semantics belong to the Grand Archive adapter and presentation belongs to the GA card wrapper.

## Rules basis

Official [Counters](https://rules.gatcg.com/game-mechanics/game-mechanics-counters): General Rules 1–6; Buff 1–4; Debuff 1–4; Bulwark 1–4; Durability 1–4; Enlighten 1; Level 1; Omen 1–2; Static and Wither. Buff counters affect existing power and life, rather than representing arbitrary temporary power modifiers. Generic counters have no inherent rules effect. The official glossary’s Preparation Counters rules 1–2 define them as champion counters that may pay additional costs when activating cards with Prepare; they are distinct from the Prepared state.

Official [Damage](https://rules.gatcg.com/game-mechanics/game-mechanics-damage): General Rules 12–13 distinguishes temporary ally damage from persistent champion damage. Counters display marked damage, not remaining life.

## Engine analysis and next boundary

The kernel routes damage-counter changes to `object.damage` and cancels opposing buff/debuff counters. The viewer exposes counters and marked damage. Both runtime and viewer-only simulator projection paths now produce identical counter decorations.

The engine also models continuous effects, durations, source identities, replacement capacity, mastery counters, and card/activation states. These are distinct concepts. A full current-stat and temporary-effect display needs a viewer-safe projection of canonical numeric derivation and source/expiry information. It must not be reconstructed by parsing printed card text or adding visible counter values in the browser. This implementation covers card counters; it does not claim to implement that separate metadata projection.

## Inspection fixture and checks

`/grand-archive/simulator/tests/counter-identity` arranges champion damage, ally damage, buffs, Bulwark, Static, Enlighten, Level, named counters and overflow through the real simulator projection. It is an arranged fixture, not a played match transcript.

Focused tests cover runtime/viewer mapping, zero handling, duplicate-damage avoidance, named counters, inspection without selecting a card, keyboard dismissal, hidden updates, authoritative count changes and combat-role labels. Browser proof covers the image-card board and inspector at desktop and 390px portrait.
