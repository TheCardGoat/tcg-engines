# Canonical card authoring

## Status

The canonical card-authoring migration is complete. Pitch families are one
strict authoring shape within the all-object model; physical printings no
longer own executable card definitions.

Current generated coverage is:

- 3,226 canonical authored units;
- 5,024 canonical runtime identities;
- 16,829 catalog printings mapped to those identities;
- zero canonical-manifest gaps or stale entries;
- zero violations in the permanent canonical-authoring audit.

This document is the maintenance contract for that final state. It does not
describe an incremental compatibility period.

## Ownership boundaries

`packages/cards/src/cards/<primary-type>/` owns executable rules behavior.
Modules are named by canonical game identity, never by set or collector number.
For example, all Snatch variants live in `cards/actions/snatch.ts`; a reprint
does not create another behavior module.

Unit-scoped modules under `packages/cards/src/generated/card-identities/` own
catalog-derived executable identity and printed game properties. Each authored
card module imports only its generated unit instead of loading one global
identity table:

- canonical id and stable slug;
- primary and complete type information;
- color, pitch, power, defense, life, intellect, and other printed values;
- declared variant membership;
- reviewed relationships between printed faces.

Adjacent `.i18n.ts` modules own localized primary names, type text, rules text,
and semantic ability or modal labels. Paired physical-face names, type text,
and default-locale rules text are resolved from the canonical catalog during
reviewed layout assembly; authored face literals are not presentation
authority. Flavor text and other text that varies by a physical printing or
locale remain printing-catalog data.

Family localization retains a type-only projection of its top-level authored
semantic ability and modal-mode keys. `defineFamilyI18n` therefore rejects
unknown ability paths, unknown mode keys, modes on non-modal abilities, and
overrides on behaviorless families in its contextual authoring literals. The
permanent authoring audit requires those overrides to be inline in that typed
family boundary and rejects indirect shorthand or spread forms. Runtime
localization validation remains the defense for widened generated data, layout
faces, and nested granted-ability paths, whose shapes are intentionally not
projected into the family type contract.

The generated runtime registry joins structured cards with the English locale
before exposing them to the engine. Exact semantic overrides take precedence;
otherwise ability and modal labels are derived deterministically from locale
rules text and semantic keys. Runtime labels must be nonempty, and choices in
one modal must be distinguishable.

The printing catalog is the only owner of:

- set codes and collector numbers;
- printing, artwork, finish, rarity, artist, and expansion-slot data;
- image assets and format legality;
- locale-specific physical-printing metadata.

## Consumer import boundaries

Consumers that execute only known cards should import their authored units,
for example `@tcg/flesh-and-blood-cards/cards/actions/snatch`. These subpaths
load the selected card family and its unit-scoped identity shard, not the
global registry or catalog.

Consumers that need searchable names, rules text, types, or legalities without
art and printing lookup should import
`@tcg/flesh-and-blood-cards/catalog-data`. The full
`@tcg/flesh-and-blood-cards/catalog` subpath intentionally joins card data with
the printing shard for collector-number, image, finish, and artwork consumers.
The package root remains the aggregate compatibility surface for applications
that intentionally need both the runtime registry and full physical catalog.

## Source layout

```text
packages/cards/src/
├── cards/
│   ├── actions/
│   ├── attack-reactions/
│   ├── defense-reactions/
│   ├── instants/
│   ├── blocks/
│   ├── equipment/
│   ├── weapons/
│   ├── heroes/
│   ├── allies/
│   ├── companions/
│   ├── resources/
│   ├── tokens/
│   ├── mentors/
│   ├── demi-heroes/
│   ├── macros/
│   ├── events/
│   ├── placeholders/
│   ├── conditions/
│   └── shared/
├── authoring/
│   ├── card.ts
│   ├── variant-family.ts
│   ├── pitch-family.ts
│   ├── family-i18n.ts
│   └── layouts.ts
└── generated/
    ├── card-identities/<primary-type>/<unit>.generated.ts
    ├── card-registry.generated.ts
    ├── flesh-and-blood-card-data.json
    ├── flesh-and-blood-card-data.ts
    ├── flesh-and-blood-printings.json
    └── flesh-and-blood-catalog.ts
```

Directory selection follows the object's primary rules type, not set, class,
talent, slot, subtype, color, or metatype. `cards/shared/` may contain reusable
behavior helpers, but it cannot own card identity, printing metadata, or a
second executable definition. There is no catch-all `misc/` directory.

## Authoring shapes

An authored unit is the smallest complete logical definition, never a physical
printing.

- `defineCard` constructs a singleton canonical object.
- `defineVariantFamily` constructs an explicitly related set of variants.
- `definePitchFamily` specializes variant authoring for red, yellow, and blue
  cards and derives pitch from color.
- `defineFamilyI18n` constructs localization for exactly the variants emitted
  by its associated family.
- typed layout helpers construct reviewed split, flip, twin, and transcend
  relationships.

The family APIs share one semantic construction path. They do not accept
positional ability collections or manufacture identity from array indexes.
Semantic ability and modal-mode ids derive from canonical identity plus an
authored behavior key. Collector-derived ids, blank nested ids, placeholder
keys, and fallback positional ids are forbidden.

A one-color playable card may be a one-member variant family. A colored
non-playable object such as Inner Chi is modeled directly and does not acquire
play or pitch-family semantics merely from its color.

## Multi-face objects

Multi-face authoring follows canonical face identity:

- a split card with one canonical identity owns both faces in one reviewed
  layout;
- flip, twin, and transcend layouts reference canonical front and back
  definitions through the reviewed layout source;
- a reusable back such as Inner Chi is authored once and may be referenced by
  several fronts;
- paired layout assembly preserves each separately localized face's executable
  ability AST;
- a paired back is registered independently only when its canonical identity
  is independently usable by the rules.

## Imports and generated registry

Consumers import canonical package subpaths when they need only a specific
unit, or the aggregate package entrypoint when they intentionally need the
physical runtime registry:

```ts
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { truthsRetold } from "@tcg/flesh-and-blood-cards/cards/equipment/truths-retold";
```

Set directories, collector-number entrypoints, per-printing wrappers, the old
pitch-only identity registry, and migration scripts do not exist. The generated
registry imports canonical structured cards and their adjacent localization,
hydrates them, applies reviewed layouts, and exports one runtime definition per
canonical id.

Adding a reprint changes catalog data only. Adding a genuinely new variant
extends the existing canonical family. Adding a new canonical object creates a
module under its primary rules type, regardless of which product introduced
it.

## Tests

Tests prove behavior, not file symmetry. Use real authored cards and legal
public moves.

When a family has identical behavior across colors, test one representative
color. Generated identity and registry checks prove structural identity and
variant-scaled printed properties for every member. Add another color test only
when its behavior materially differs.

Behaviorless tokens and metadata-only placeholders do not need empty presence
tests. Generated identity, localization, reviewed-layout, catalog-model, and
registry checks provide their structural coverage.

## Permanent gates

From `packages/cards`, run:

```sh
pnpm run check-types
pnpm run test:canonical-authoring
pnpm run test:canonical-card-manifest
pnpm run test:card-identities
pnpm run test:canonical-card-layout
pnpm run test:card-catalog-sync
```

`check-types` includes the strict `check:canonical-authoring` gate. It rejects:

- direct or obsolete card factories;
- executable set, collector, or other printing metadata;
- executable display text;
- redundant authored id/text fields and collector-derived, blank nested,
  positional, or placeholder semantic ids;
- localization overrides outside the typed semantic family boundary;
- set/collector paths and imports;
- removed factories, generated artifacts, and migration scripts.

Generation checks must also prove that every catalog identity maps to exactly
one authored unit and runtime export, every printing maps to an existing
canonical identity, reviewed layouts reference real and distinct faces and
produce their declared physical runtime kind, and generated files are current.

Run focused legal-move suites for changed behavior, then the owning Flesh and
Blood `pnpm run ci-check` gate before delivery. Do not weaken the types or add a
compatibility wrapper to bypass a failing canonical boundary; fix the owning
identity, authoring helper, generated model, or consumer instead.
