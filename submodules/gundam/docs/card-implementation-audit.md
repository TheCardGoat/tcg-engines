# Card Implementation Audit

Generated from `packages/cards/src/cards/**/*.ts` and matching card tests.

## Summary

- Total card definitions scanned: 848
- Reminder/setup-only card definitions excluded: 105
- Cards with effect text still needing implementation or verification: 0
- Cards with effect text but empty `effects: []`: 0
- Cards with parsed effect shells that contain `directives: []`: 0
- Cards with todo/skip tests: 0
- Cards with effect text and no matching test file: 0

## Missing Work By Mechanic

| Bucket | Cards |

## Missing Work By Set

| Set | Cards |

## Missing Work By Type

| Type | Cards |

## Card List

| Card | Type | Bucket | Evidence |

## Notes

- `parsed shell has no directives` means the parser identified a timing/header but produced no executable directives, so the engine has nothing meaningful to resolve.
- `todo/skip` evidence means the card has an explicit pending card-level behavior test, even if part of its effect is already modeled.
- Cards with only printed keywords and no effect text are excluded unless they have a pending test.
