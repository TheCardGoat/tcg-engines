# Foundation Card Types

Flesh and Blood card data has three persisted layers and one input-only authoring layer. Each field has one owner. Runtime rules data does not absorb display metadata, and catalog data does not become executable.

```text
Catalog (display)              Runtime (executable)             Engine (registered)
FleshAndBloodCatalogCard   FleshAndBloodCard                FleshAndBloodCard
  names and typeText            canonicalId and slug             plus admission checks
  printings and images          layout                           no property remapping
  legalities and provenance     base
  functional/flavor text          names, activeFaceIds
                                      color, typeBox(es), traits
                                      numeric, keywords, abilities
             join by canonicalId
```

The generated `CanonicalCardIdentity` and authored `CardBehaviorOptions` are inputs to `defineCard` and `definePitchFamily`; they are not persisted runtime models. Identity shards emit a structured `typeBox` and may retain the input-only `health` and `intelligence` aliases. Constructors normalize those aliases into the runtime card.

## Ownership

- Catalog types own display and physical-printing facts: names, localized and functional text, type text, printings, artwork, artists, legalities, and provenance. Public `FleshAndBloodCatalogCard` records never expose executable abilities, rules keywords, type-token arrays, traits, or numeric rules properties such as pitch, cost, power, defense, life, or intellect.
- Catalog refresh keeps a separate source artifact with the upstream fields needed to regenerate identity shards. Its `FleshAndBloodCatalogSourceCard` types and source-preserving hydration are tooling inputs only; runtime, adapter, and UI code must join display records to authored cards by `canonicalId` instead of executing source data.
- Generated identity shards own stable canonical identity and printed inputs used by constructors. They import only their generated shard.
- Authored card modules own executable behavior: typed keywords, the closed ability IR, semantic ability keys, and i18n overlays. Authored modules do not own printings or set identity.
- `FleshAndBloodCard` is the runtime card. `base` is its only printed-property record. Canonical runtime names are `numeric.life`, `numeric.intellect`, and numeric `numeric.pitch`; color is `FabColor | null`; type boxes and keywords use their closed vocabularies.
- Engine registration validates layout and trigger admission. It normalizes the explicit loose `FabCardDefinitionInput` boundary used by tests and adapters, but registered match state contains `FleshAndBloodCard` and rules consumers read `base` without re-parsing aliases.
- The engine never imports `@tcg/flesh-and-blood-cards`. Adapters and test harnesses register authored definitions.

`FleshAndBloodCard` has exactly four fields: `canonicalId`, `slug`, `layout`, and `base`. There are no top-level printed-property mirrors.

## Closed discriminants

The ability IR is a JSON-serializable discriminated union. Every discriminant has one owning registry in `packages/types/src/abilities/discriminant-ownership.ts`, and exhaustive consumers use `never` checks. Adding a variant must fail TypeScript compilation until each registry and exhaustive consumer handles it. Do not replace the union with a generic `{ type, args }` bag, add a card-text parser, or bypass the model with casts.

The same principle applies to type-box tokens, traits, colors, layouts, keywords, and status markers: loose strings are accepted only at a named normalization input boundary and are rejected before registration.

## Dead types

The following overlapping models were deleted rather than extended:

- `FleshAndBloodStructuredCard` — unused catalog/runtime intersection.
- `FleshAndBloodCardAbilities` — historical card-level wrapper; runtime behavior lives in `base`.
- `FleshAndBloodCardMetadata` — legacy per-set display wrapper superseded by catalog slices.
- `FabTokenDefinition` — legacy token-shaped wrapper; tokens use the same runtime card model.

Do not introduce another general card constructor. `defineCard` and `definePitchFamily` remain the public authoring surface; `defineVariantFamily` stays internal until a non-pitch family requires it.
