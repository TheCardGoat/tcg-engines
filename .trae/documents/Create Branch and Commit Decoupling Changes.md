I will create a new branch and commit the changes to decouple the Gundam engine.

### Plan
1.  **Create Branch**: Create and switch to a new branch named `feature/decouple-gundam-engine`.
2.  **Stage Changes**: Run `git add .` to stage all modified, deleted, and new files (including the new `gundam-cards` and `gundam-types` packages).
3.  **Commit**: Commit the changes with a descriptive message explaining the refactoring.

### Commit Message
```
refactor(gundam): decouple engine, cards, and types

- Created `@tcg/gundam-types` for shared type definitions (cards, abilities, targeting).
- Created `@tcg/gundam-cards` for card definitions, tools, and scripts.
- Refactored `@tcg/gundam` (engine) to remove card-specific logic and depend on the new packages.
- Updated all imports and references to use the new package structures.
```
