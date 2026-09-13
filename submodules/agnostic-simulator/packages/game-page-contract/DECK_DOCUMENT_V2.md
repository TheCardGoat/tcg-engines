# DeckDocument V2

`DeckDocumentV2` is the durable, game-agnostic envelope for a saved deck. It
stores facts about one deck. It does not store the rules which interpret those
facts.

```ts
interface DeckDocumentV2 {
  schemaVersion: 2;
  game: GameType;
  formatId: string;
  name?: string;
  sections: Record<string, DeckDocumentEntryV2[]>;
  declarations?: Record<string, JsonValue>;
  appearance?: Record<string, JsonValue>;
}
```

The owning game adapter exposes an immutable format definition. That definition
declares which sections and extension fields exist for a format, which sections
participate in validation/runtime, and count constraints such as exact, minimum,
maximum, or non-contiguous allowed totals. Game-native validators continue to
own rules which cannot be reduced to counts: colors, names, card types, copy
limits, rotation, bans, and card-text exceptions.

`formatId` is the durable version boundary. Once persisted, an id must keep the
same interpretation; a breaking format change gets a new id. This prevents an
old deck from being silently reinterpreted by a newer in-memory definition.

## `selections`, `declarations`, and `appearance`

There is intentionally no generic `selections` field in V2. The word mixed
three different lifecycles which must not be handled alike:

- `declarations` are durable, rules-significant choices which are part of the
  submitted deck but are not additional registered copies. A Grand Archive
  starting Champion selected from the material deck is the clearest example.
- `appearance` contains deck-scoped cosmetic choices which do not change deck
  legality or composition identity. Gundam EX Base and EX Resource artwork are
  examples.
- Temporary pregame decisions do not belong in the saved deck document. Flesh
  and Blood chooses the actual arena cards and starting deck from the registered
  card-pool for each game.

This split prevents a cosmetic change from altering legality or a composition
hash, while preserving a rules-significant declaration through storage,
sharing, matchmaking, and replay setup.

## Why V1 had presentation sections, and why V2 does not

V1 attached `roles` such as `validation`, `runtime`, and `presentation` to every
section. That made generic flattening convenient, but it let each saved payload
redefine lifecycle policy. It also forced non-deck objects such as Gundam EX
tokens to masquerade as registered card copies in a `setup` section.

V2 has no roles in persisted sections. A section contains registered card
copies only. The selected, immutable format definition owns section meaning
and lifecycle. Cosmetic values which do not correspond to registered copies
live at root `appearance`.

The one deliberate appearance value inside a section entry is a printing
allocation. It describes the physical/cosmetic versions of those exact
registered copies:

```json
{
  "card": { "canonicalId": "CARD-1", "quantity": 4 },
  "appearance": {
    "printingAllocations": [
      { "printingId": "CARD-1_p1", "quantity": 3 },
      { "printingId": "CARD-1_p2", "quantity": 1 }
    ]
  }
}
```

Allocations must total the registered quantity. They are ignored by legality
and composition identity. An allocation may omit `printingId` to mean that
those copies use the catalog's default presentation.

## Invariants

- `sections` is keyed by section id and contains only sections supported by the
  selected format.
- One canonical card identity appears at most once in a section.
- Quantities are positive integers.
- Printing allocations are unique per printing and exactly cover the card
  quantity when present.
- Section roles, labels, ordering, and count rules are format metadata, not
  user-authored deck data.
- Unknown games, formats, sections, schema versions, cards, and printings fail
  closed.
- V1 is read only through an explicit migration path. New writes are V2.

## Supported games: rules and examples

The examples are abbreviated; ids stand in for real canonical card ids. “V1”
describes the representation before this change.

### Disney Lorcana

All supported Lorcana constructed snapshots use one registered main deck with
at least 60 cards. The game validator owns the two-ink limit, four-copy limit,
set rotation, bans, and card-specific exceptions. The adapter retains format
snapshots for Infinity, Core Constructed, Attack of the Vine, Shimmering Skies,
Azurite Sea, and Archazia's Island. Queue policy separately decides which
snapshots are currently active.

V1 stored an array and repeated lifecycle roles:

```json
{"schemaVersion":1,"game":"lorcana","formatId":"infinity","sections":[{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"L1","printingId":"L1_p2","quantity":4}]}]}
```

V2 keys the registered section and attaches artwork to the copies:

```json
{"schemaVersion":2,"game":"lorcana","formatId":"infinity","sections":{"main":[{"card":{"canonicalId":"L1","quantity":4},"appearance":{"printingAllocations":[{"printingId":"L1_p2","quantity":4}]}}]}}
```

Existing Lorcana versions are migrated losslessly, including mixed printing
allocations. Older versions without a document are reconstructed from their
immutable mainboard snapshot.

### Gundam Card Game

Standard registers exactly 50 Unit/Pilot/Command/Base cards and exactly 10
Resource cards. A main deck uses one or two colors, has at most four copies of
one card number, and the Resource Deck may repeat Resource cards without a
copy limit. BO3 additionally registers exactly 10 sideboard cards; copy and
color rules apply across main plus sideboard. EX Base and EX Resource are setup
tokens, not deck or Resource Deck cards.

V1 represented token artwork as fake registered copies:

```json
{"schemaVersion":1,"game":"gundam","formatId":"standard","sections":[{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"GD01-001","quantity":4}]},{"id":"resource","roles":["validation","runtime"],"entries":[{"canonicalId":"R-001","quantity":10}]},{"id":"setup","roles":["presentation"],"entries":[{"canonicalId":"EXB-001","printingId":"EXB-001_p5","quantity":1}]}]}
```

V2 keeps only registered copies in sections and moves token artwork to root
appearance:

```json
{"schemaVersion":2,"game":"gundam","formatId":"standard","sections":{"main":[{"card":{"canonicalId":"GD01-001","quantity":4}}],"resource":[{"card":{"canonicalId":"R-001","quantity":10}}]},"appearance":{"setup":{"ex-base":"EXB-001_p5","ex-resource":"EXR-001_p6"}}}
```

Existing Gundam versions are migrated losslessly. BO3 preserves `side`; V1
`setup` becomes `appearance.setup`.

### Cyberpunk TCG

The Alpha format registers exactly 3 Legends and a main deck of 40–50
non-Legend cards. Legend names must be unique, main-deck name/subtitle copies
are capped at three, and the Legends establish the deck's RAM limits.

V1 declared a fixed global topology including editor workspaces:

```json
{"schemaVersion":1,"game":"cyberpunk","formatId":"alpha","sections":[{"id":"legend","roles":["validation","runtime"],"entries":[{"canonicalId":"LEGEND-1","quantity":1}]},{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"CP-1","quantity":3}]},{"id":"side","roles":[],"entries":[]},{"id":"maybe","roles":[],"entries":[]}]}
```

V2 contains the submitted deck only. Side/maybeboard editor state is not part
of the authoritative document:

```json
{"schemaVersion":2,"game":"cyberpunk","formatId":"alpha","sections":{"legend":[{"card":{"canonicalId":"LEGEND-1","quantity":1}}],"main":[{"card":{"canonicalId":"CP-1","quantity":3}}]}}
```

Cyberpunk is reset to blank-slate V2 storage; V1 is not accepted.

### One Piece Card Game

Standard registers exactly 1 Leader, a 50-card main deck, and a 10-card DON!!
deck. Main-deck colors must be present on the Leader and the normal limit is
four copies per card number, subject to deck-construction effects.

V1 already named the right sections, but the adapter remapped `leader` into
`main` at runtime because the historical engine searched for it there:

```json
{"schemaVersion":1,"game":"one-piece","formatId":"standard","sections":[{"id":"leader","roles":["validation","runtime"],"entries":[{"canonicalId":"OP-L1","quantity":1}]},{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"OP-1","quantity":4}]},{"id":"don","roles":["validation","runtime"],"entries":[{"canonicalId":"DON-1","quantity":10}]}]}
```

V2 preserves native sections end to end; the game lifecycle consumes them
without a document-level remapping workaround:

```json
{"schemaVersion":2,"game":"one-piece","formatId":"standard","sections":{"leader":[{"card":{"canonicalId":"OP-L1","quantity":1}}],"main":[{"card":{"canonicalId":"OP-1","quantity":4}}],"don":[{"card":{"canonicalId":"DON-1","quantity":10}}]}}
```

One Piece is reset to blank-slate V2 storage; V1 is not accepted.

### Riftbound

Current constructed registration is exactly 1 Champion Legend, exactly 40
main-deck cards including the Chosen Champion, exactly 12 Runes, exactly 3
uniquely named Battlefields, and—where enabled—exactly 0 or 8 main-deck-legal
sideboard cards. The game validator owns domain identity, name-copy limits,
signature rules, and Chosen Champion compatibility.

V1 mixed registered components with editor-only workspaces and treated the
sideboard as non-runtime data:

```json
{"schemaVersion":1,"game":"riftbound","formatId":"standard","sections":[{"id":"legend","roles":["validation","runtime"],"entries":[{"canonicalId":"RB-L1","quantity":1}]},{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"RB-1","quantity":3}]},{"id":"battlefield","roles":["validation","runtime"],"entries":[{"canonicalId":"BF-1","quantity":1}]},{"id":"rune","roles":["validation","runtime"],"entries":[{"canonicalId":"RUNE-1","quantity":12}]},{"id":"side","roles":[],"entries":[]},{"id":"bench","roles":[],"entries":[]}]}
```

V2 keeps the registered sideboard, drops the editor-only bench, and records
which registered main-deck card is the starting Chosen Champion:

```json
{"schemaVersion":2,"game":"riftbound","formatId":"standard","sections":{"legend":[{"card":{"canonicalId":"RB-L1","quantity":1}}],"main":[{"card":{"canonicalId":"RB-1","quantity":3}}],"battlefield":[{"card":{"canonicalId":"BF-1","quantity":1}}],"rune":[{"card":{"canonicalId":"RUNE-1","quantity":12}}],"side":[]},"declarations":{"chosenChampionId":"RB-1"}}
```

Riftbound is reset to blank-slate V2 storage; V1 is not accepted.

### Naruto Card Game Preview

The primary welcome page confirms a stated 51-card deck, 5 Chakra cards, and 1
Summon card, but does not publish the composition of those 51 cards or say
whether the Leader is included. The current Preview engine therefore uses a
clearly provisional topology: 1 Leader, 50 main-deck cards, 5 Chakra cards, and
1 Summon card.

V1:

```json
{"schemaVersion":1,"game":"naruto","formatId":"preview","sections":[{"id":"leader","roles":["validation","runtime"],"entries":[{"canonicalId":"N-L1","quantity":1}]},{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"N-1","quantity":4}]},{"id":"chakra","roles":["validation","runtime"],"entries":[{"canonicalId":"N-C1","quantity":5}]},{"id":"summon","roles":["validation","runtime"],"entries":[{"canonicalId":"N-S1","quantity":1}]}]}
```

V2 retains the topology but makes its provisional format ownership explicit:

```json
{"schemaVersion":2,"game":"naruto","formatId":"preview","sections":{"leader":[{"card":{"canonicalId":"N-L1","quantity":1}}],"main":[{"card":{"canonicalId":"N-1","quantity":4}}],"chakra":[{"card":{"canonicalId":"N-C1","quantity":5}}],"summon":[{"card":{"canonicalId":"N-S1","quantity":1}}]}}
```

Naruto is reset to blank-slate V2 storage; V1 is not accepted. The model must
be revised when an authoritative comprehensive rulebook resolves composition.

### Flesh and Blood

Constructed play registers one Hero plus a card-pool. Classic Constructed and
Living Legend allow up to 80 arena/deck cards; Blitz up to 52; Silver Age up to
55. The actual arena cards and starting deck are selected from that pool during
the start-of-game procedure (CC/LL start with at least 60 deck cards; Blitz and
Silver Age exactly 40).

V1 persisted one temporary split as if it were the durable registration:

```json
{"schemaVersion":1,"game":"flesh-and-blood","formatId":"cc","sections":[{"id":"hero","roles":["validation","runtime"],"entries":[{"canonicalId":"HERO-1","quantity":1}]},{"id":"equipment","roles":["validation","runtime"],"entries":[{"canonicalId":"EQ-1","quantity":1}]},{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"FAB-1-R","quantity":3}]},{"id":"inventory","roles":["validation","runtime"],"entries":[{"canonicalId":"FAB-2-B","quantity":2}]}]}
```

V2 stores the registered pool; pregame selection owns the per-game split:

```json
{"schemaVersion":2,"game":"flesh-and-blood","formatId":"cc","sections":{"hero":[{"card":{"canonicalId":"HERO-1","quantity":1}}],"cardPool":[{"card":{"canonicalId":"EQ-1","quantity":1}},{"card":{"canonicalId":"FAB-1-R","quantity":3}},{"card":{"canonicalId":"FAB-2-B","quantity":2}}]}}
```

Flesh and Blood is reset to blank-slate V2 storage; V1 is not accepted.

### Grand Archive

Standard registers a main deck of at least 60 cards, a material deck of at
most 12 containing a level-0 Champion, and a sideboard of at most 15 cards and
15 points. Draft uses at least 30 main cards, at most 10 material cards, and
the rest of the pool as sideboard. Pantheon uses at least 60 singleton main
cards, exactly 12 material cards, one Lesser Boon, one Greater Boon, and no
sideboard.

V1 could store the three card piles but could not say which level-0 Champion
starts the game or represent Pantheon's Boons without inventing more sections:

```json
{"schemaVersion":1,"game":"grand-archive","formatId":"standard","sections":[{"id":"main","roles":["validation","runtime"],"entries":[{"canonicalId":"GA-1","quantity":4}]},{"id":"material","roles":["validation","runtime"],"entries":[{"canonicalId":"GA-C1","quantity":1}]},{"id":"sideboard","roles":["validation","runtime"],"entries":[]}]}
```

V2 keeps registered piles in sections and the rules-significant choice in
`declarations`:

```json
{"schemaVersion":2,"game":"grand-archive","formatId":"standard","sections":{"main":[{"card":{"canonicalId":"GA-1","quantity":4}}],"material":[{"card":{"canonicalId":"GA-C1","quantity":1}}],"sideboard":[]},"declarations":{"startingChampionId":"GA-C1"}}
```

Pantheon adds `lesserBoonId` and `greaterBoonId` declarations. A cosmetic
Pantheon Barrier printing belongs in root `appearance`, not declarations or a
card section.

Grand Archive is reset to blank-slate V2 storage; V1 is not accepted.

## Rules sources

- Disney Lorcana: [official rules resources](https://www.disneylorcana.com/en-US/resources)
- Gundam Card Game: [deck construction guide](https://www.gundam-gcg.com/en/news/decks-build.html) and [Best of Three rules](https://www.gundam-gcg.com/en/news/best-of-three.html)
- Cyberpunk Trading Card Game: [comprehensive rules](https://cyberpunktcg.com/comprehensive-rules)
- One Piece Card Game: [comprehensive rules](https://en.onepiece-cardgame.com/pdf/rule_comprehensive.pdf?20240222=)
- Riftbound: [rules hub](https://playriftbound.com/en-us/rules-hub/) and [tournament rules](https://playriftbound.com/en-us/news/organizedplay/riftbound-tournament-rules/)
- Naruto Mythos: [official welcome and deck overview](https://www.naruto-cardgame.com/en/welcome/)
- Flesh and Blood: [constructed format rules](https://rules.fabtcg.com/en/trp/07-constructed-formats/)
- Grand Archive: [format conventions](https://rules.gatcg.com/general-rules/general-rules-format-conventions)

## Migration policy

The database migration upgrades every Lorcana and Gundam V1 version in place,
then verifies that all surviving active-player documents are V2 objects. It
deletes decks for every other game, relying on existing foreign-key actions to
remove versions and clear references. After the migration:

- only V2 may be written;
- Lorcana and Gundam adapters retain V1 readers solely for old URLs or payloads
  that escaped database migration;
- every other adapter rejects V1 and requires a newly created V2 deck.
