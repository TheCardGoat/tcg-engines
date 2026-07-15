---
name: lorcana-find-card
description: Locate Lorcana cards in `packages/lorcana/lorcana-cards` and return deterministic, ranked similar-card references for implementation work. Use when a user asks to find a card by name/slug/set-number, needs definition/test file paths, or needs similar implementation examples.
---

# Lorcana Find Card

Resolve card identity and provide ranked implementation references.

## Required Memory Step

1. Read `memory/schema.md`.
2. Read the Guardrails and Promoted Rules sections of `memory/bank.md`.
3. Apply guardrails before returning results.

## Input Contract

```ts
type FindCardInput = {
  query: string; // card id, set-number, slug, or name (required)
  k?: number; // number of similar cards to return (default: 10, max: 25)
  filter?: {
    cardType?: "character" | "action" | "item" | "location";
    requireActiveTest?: boolean; // exclude empty/legacy-only test files
    excludeKeywordOnly?: boolean; // exclude pure keyword-smoke cards
    hasTriggerEvent?: string; // e.g. "play", "quest", "challenge", "banish"
    hasEffectType?: string; // e.g. "deal-damage", "draw", "play-card"
    sameSet?: boolean; // restrict similar pool to the target's set
  };
};
```

`k` is the canonical name for the requested neighbor count. Callers should always pass `k` explicitly; defaulting is for ad-hoc CLI use.

## Fast Path CLI (Preferred)

```bash
bun packages/lorcana/lorcana-cards/src/cards/similarity.ts \
  --query "<card name|id|set-number|set-number-slug>" \
  --limit <k>
```

`--limit` maps to `k`. Filter flags are applied client-side (see Output Contract — callers post-filter on `reason[]` until the CLI grows native filter flags; tracked as a known gap).

Interpret the JSON result:

- `status: "ok"`: Use returned `files` and `similarCards` directly.
- `status: "ambiguous"`: Show candidates and ask the user to choose one. Never guess.
- `status: "not_found"`: Continue with manual deterministic lookup below.

## Manual Deterministic Lookup (Fallback)

Search canonical card files in:

- `packages/lorcana/lorcana-cards/src/cards/{SET}/characters/{NUM}-*.ts`
- `packages/lorcana/lorcana-cards/src/cards/{SET}/actions/{NUM}-*.ts`
- `packages/lorcana/lorcana-cards/src/cards/{SET}/items/{NUM}-*.ts`
- `packages/lorcana/lorcana-cards/src/cards/{SET}/locations/{NUM}-*.ts`

Use `rg --files` + name/slug filtering. When punctuation drift is suspected (apostrophes), compare both legacy (`world-s-...`) and current (`worlds-...`) slug forms.

## Similarity Scoring (Deterministic, v1)

Additive weights, frozen at `scoringVersion: "v1"`:

- `+40` same card type (`character`/`action`/`item`/`location`)
- `+25` shared effect verbs (`draw`, `banish`, `damage`, `discard`, `ready`, `exert`, `quest`, `move`)
- `+20` shared trigger family (`when played`, `whenever`, `start/end of turn`, `static while`)
- `+10` shared named-synergy or keyword family
- `+5` same ink color
- `+5` newer set tie-break preference

Tie-break order:

1. Higher score
2. Higher set number
3. Lexicographic card id

When changing weights or signals, bump `scoringVersion` and document the change in `memory/bank.md` under Promoted Rules.

## Output Contract

```json
{
  "scoringVersion": "v1",
  "status": "ok",
  "name": "string",
  "title": "string",
  "cardId": "set-number-slug",
  "set": "001",
  "number": 1,
  "type": "character",
  "files": {
    "definition": "packages/lorcana/lorcana-cards/src/cards/...",
    "test": "packages/lorcana/lorcana-cards/src/cards/...test.ts"
  },
  "similarCards": [
    {
      "cardId": "string",
      "score": 0,
      "reason": ["string"],
      "definition": "path",
      "test": "path"
    }
  ]
}
```

Return `k` similar cards (default 10).

## Ambiguity Handling

If multiple cards match the lookup term, return `status: "ambiguous"` with full candidates. Ask for explicit selection. Do not auto-pick on score.

## Post-Execution Memory Update

Follow `memory/schema.md`. Capture:

- bad matches (wrong neighbor was returned at top-k) — file as a candidate observation
- ranking mistakes that recur — promote to a guardrail when seen ≥ 3 times across distinct queries
