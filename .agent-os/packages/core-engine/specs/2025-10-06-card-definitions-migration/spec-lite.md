# Spec Summary (Lite)

Migrate all Lorcana card definitions from legacy patterns to the new type-safe API in lorcana-card-repository.ts. Each card file must pass TypeScript type checking without using type assertions, `any`, or `unknown` types. Test files remain unchanged but must also pass type checking, requiring framework stubs for missing APIs. Migration proceeds incrementally by set and card type (e.g., Set 001 Actions first), with each file individually validated using `tsc --noEmit`.
