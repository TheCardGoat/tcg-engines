# Star Wars Unlimited Card Import

This tool refreshes `packages/cards/src` from the public Star Wars Unlimited card
API used by the official card database.

```sh
pnpm run import:card-data
```

The importer treats API printed metadata as authoritative and rewrites:

- `packages/cards/src/cards/**`
- `packages/cards/src/cards/index.ts`
- `packages/cards/src/generated.ts`

Existing authored behavior is preserved when a card definition has non-keyword
abilities or executable keyword effects. Cards that only have generated empty
keyword abilities are refreshed from current API keywords. New API cards are
created automatically with printed metadata and generated keyword abilities.

After running the importer for a new release, run:

```sh
pnpm --dir packages/cards run test -- src/catalog.test.ts
pnpm run ci-check
```
