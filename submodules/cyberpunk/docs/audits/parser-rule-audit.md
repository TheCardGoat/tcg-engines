# Cyberpunk parser rule audit (2026-09-24)

## Scope and authority

This audit examines `tools/parser/src/parser.ts` outputs for selectors, count operands, conditions, and effect duration. The generated catalog is the parser input, while `packages/cards/src/cards` is the playable authored catalog. The official Comprehensive Rules mirror governs area and timing semantics. Relevant rules: 2.1.1 (a player may decline a text part only when it says “you may”), 4.2.1 (field Legends are Units and Legends), 4.4 (Legends can occupy the Legends area or field), 4.10–4.10.2 (Gear hosts are friendly Units or face-up Legends in those areas), and 10.4.3/10.22 (persistent effects apply continuously while active).

## Confirmed parser drift and guard

The Alpha printing of Jackie Welles — Ride Or Die Choom says “+2 power for each of your friendly gigs.” The parser used `FRIENDLY_GIG_TARGET`, whose `amount: 1` is correct for a single-Gig action. `resolveNumericValue` counts resolved target IDs, and `resolveGigTarget` truncates `amount: 1` to one ID. Thus the parsed static bonus stopped growing after the first Gig. The parser now uses an `amount: "all"` count operand, with a focused parser test asserting the complete emitted operand and continuous duration. This does not alter the current Welcome to Night City printing of Jackie, which has separate even/odd Gig effects and is authored independently.

The parser now imports the shared `legendsInPlay` and `unitsAndLegendsInPlay` selectors from types for all-zone face-up Legend counts and default Gear hosts. This follows rules 4.4 and 4.10. Some remaining `legendArea` selectors are intentional: face-down Legends to Call or look at must be in the Legends area, and a printed bonus explicitly says “in your Legends area.” Unit-only `field` selectors rely on the rule 4.2.1 engine model that treats a field Legend as a Unit. A single-Gig `amount: 1` target remains valid for effects that adjust, steal, or select one Gig; it must not be reused as a count operand.

Default Gear host rules now apply even when the scraped text omits the Equip reminder, as on Overwatch, The Relic, and Zetatech Berserk. Octant's printed per-8+-Gig play-cost reduction now emits a cost modifier. The parser parity check compares these fields against matching authored cards.

The reviewed parser patterns distinguish continuous static effects from turn-limited and next-turn effects. For example, the Alpha Jackie bonus is continuous, while a played Program's power bonus is for the turn; “can't attack until your next turn” uses `untilSourceNextTurn`. The condition for “during your turn” is emitted as `turn: friendly`. These are parser-shape checks, not a claim that every authored card is parsed.

A matching-printing comparison found 48 cards with an implemented non-keyword parser ability. The parity test compares their full ability structure after excluding display text and unsupported empty abilities. It also compares all 152 current cards' cost modifiers and attachment targets. It found and corrected three Gig-steal event drifts: Maelstrom Goons, Rogue Amendiares — Preem Solo, and V — Roamer of the Badlands need per-Gig trigger semantics; V also must target the rival Gig being stolen. The 11 other previously divergent supported patterns are now corrected against their printed text and authored definitions:

| Card | Corrected parser semantics |
| --- | --- |
| Arasaka Emergency Radioport | One Call with an ARASAKA-or-Go-Solo condition after looking at the selected Legend. |
| Chrome Reverie | Mandatory rival attack restriction; only the Call is optional. |
| Corporate Surveillance | Selects one ready rival Unit. |
| Gilded Maton | Sacrifices a friendly Gear attached to a friendly Unit or Legend in play. |
| Gunpoint Diplomacy | The ready-Unit attack permission has one use. |
| Heywood Ripperdoc | Selects a Gear in the field or Legends area. |
| Memory Relapse | Selects a ready rival Unit to spend. |
| Misty Olszewski — Mender of Broken Spirits | Emits both the continuous attack restriction and end-of-turn trigger. |
| Padre — Man of the Cross | Selects a ready rival Unit; Gig-value copy requires two players. |
| Peace Offering | Allows declining the Gig copy and validates the chosen pair. |
| Three Mouths, One Desire | Requires the first card added to hand. |

The parity test has no exception list. A new mismatch in any supported family fails it. An independent printed-text check also found the Panam Palmer — Strength Through Family ATTACK discard is mandatory; the parser and authored definition no longer mark it optional.

## Current coverage limit

`parseStructuredCards` currently selects 152 generated cards: 140 Welcome to Night City retail, 5 The Heist retail starter, 5 Embracing Power retail starter, 1 PRM01, and 1 promo. Before the diagnostic contract, 90 cards emitted at least one effectless `static` ability from the broad unsupported-pattern fallback (82, 4, 4, 0, and 0 respectively). Two were flavor quotes; the rest contained actionable or rules-bearing card text, including Alt Cunningham — Mother of Daemons, Gorilla Arms, Sandevistan, and The Heist. This historical metric is a conservative warning signal, not a count of 90 broken playable cards: these retail cards have separate authored definitions. `parseStructuredCards` does not include Alpha printings; the Jackie regression calls `parseStructuredCard` on its Alpha catalog entry.

The historical 90 effectless segments classified as 2 flavor quotes (Emergency Atlus and Mantis Blades) and **88 actionable or rules-bearing text segments**. No keyword-only segment appeared as an effectless static ability in that snapshot; supported standalone keywords were emitted as `keyword` abilities. This count is an audit snapshot, not a test expectation, because parser support should improve without a hard-coded coverage ceiling.

Runtime uses `packages/cards/src/cards/index.ts` and its 152 authored card definitions, then `merged.ts`/`bundle.ts`; it does not consume `parseStructuredCards` on a match path. `generated.ts` is the raw scraped catalog and printing source. Within this repository, parser entry points are exported from `tools/parser/src/index.ts` and consumed by parser tests and `generate-engine-tests.ts` (promo fixture generation). That generator rejects partial results before clearing or writing its output tree.

Older and newer printings with the same slug may have different text. In particular, Alpha Jackie has the continuous all-Gig bonus, while the current Welcome to Night City Jackie has an ATTACK even-Gig bonus and a DEFEATED odd-Gig draw. Do not compare parser output for one printing to the authored definition of another and label the difference a regression.

## Diagnostic contract

All public single-card and array/set entry points now return parser-local `ParseResult<T> = { definition: T; unparsedSegments: Array<{ cardSlug; text; reason; sourceRange? }> }`. Unsupported patterns retain their text and rejection reason in diagnostics and emit no effectless static ability. Explicit flavor text is ignored and standalone supported keywords remain keyword abilities. The generator rejects a partial promo result before changing its output tree. `CardDefinition` stays free of parser diagnostics because runtime cards are authored. A focused test proves that a supported restriction survives beside an unsupported segment, that batch parsing propagates the diagnostic, and that a rejected generation leaves existing files in place. The parser still supports only part of the retail catalog; downstream ingestion must inspect diagnostics before using its definitions. Shared selectors are useful for stable reusable meanings such as “face-up Legends in play”; a blanket duplicate-text check would incorrectly reject legitimate area-specific and single-target selectors.
