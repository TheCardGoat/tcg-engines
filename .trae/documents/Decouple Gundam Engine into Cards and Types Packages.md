I will decouple the `gundam-engine` package by creating two new packages: `gundam-cards` and `gundam-types`, following the `lorcana` reference architecture.

### **Plan Overview**

1.  **Create `packages/gundam-types`**
    *   Initialize package structure (`package.json`, `tsconfig.json`).
    *   Move shared type definitions from `gundam-engine` to `gundam-types`:
        *   `gundam-engine/src/cards/card-types.ts` → `gundam-types/src/cards/card-types.ts`
        *   `gundam-engine/src/cards/effects/types/*.ts` → `gundam-types/src/abilities/*.ts` (matching Lorcana's structure).
    *   Export these types from `gundam-types/src/index.ts`.

2.  **Create `packages/gundam-cards`**
    *   Initialize package structure (`package.json`, `tsconfig.json`).
    *   Move card data and tools from `gundam-engine` to `gundam-cards`:
        *   `gundam-engine/tools/` → `gundam-cards/tools/`
        *   `gundam-engine/src/cards/sets/` → `gundam-cards/src/cards/`
    *   Configure dependencies:
        *   Add `@tcg/gundam-types` as a dependency.
        *   Add `@tcg/core` and other necessary dev dependencies.

3.  **Refactor `packages/gundam-engine`**
    *   Remove the moved files and directories.
    *   Add dependency on `@tcg/gundam-types`.
    *   Update all imports in `gundam-engine` to import types from `@tcg/gundam-types` instead of local paths.
    *   Clean up `src/cards/index.ts` and ensure the engine still builds.

4.  **Verification**
    *   Run `bun install` to link workspaces.
    *   Run type checks (`bun run check-types`) on all three packages to ensure no broken references.

### **Dependencies**
*   **`gundam-types`**: No internal dependencies (except `@tcg/core` types if needed).
*   **`gundam-cards`**: Depends on `gundam-types`.
*   **`gundam-engine`**: Depends on `gundam-types`.
