# Arcanite Fortress behavior proof

The executable card scenarios live beside the production definition in
[`arcanite-fortress.test.ts`](../../../../../../cards/src/cards/equipment/arcanite-fortress.test.ts).

The previous three scenarios in this directory used numeric deck padding, a
fabricated damage source, raw state reads, and definition-shape assertions.
Their behavioral obligations now execute through six real-card scenarios:

- One or two own Arcanite equipment determine both actual physical prevention
  and Spellvoid prevention of Voltic Bolt's five arcane damage.
- Opposing Arcanite equipment and own non-Arcanite equipment do not count.
- Accepting Spellvoid destroys Fortress; declining takes all damage and retains it.
- Guardwell after defending removes the full current defense (one or two),
  retains the chest, and leaves the non-defending Skullcap unchanged.

Rules references: CR 8.3.15 (Spellvoid), CR 8.3.34 (Guardwell), and the Rosetta
release notes for Arcanite Fortress's live count. This reference is not separate
card acceptance; remaining source/printing and interaction obligations stay in
the campaign ledger.
