I will modify `file-writer.ts` to implement the requested directory structure: `src/cards/[set]/[cardType]/[card].ts`.

**Plan:**
1.  **Modify `saveCardFile` in `file-writer.ts`**:
    *   Change `setDir` to include `card.cardType.toLowerCase()` as a subdirectory.
    *   Example: `src/cards/gd01/unit/001-gundam.ts`.
2.  **Modify `generateSetIndex` in `file-writer.ts`**:
    *   It currently iterates through all cards in a set. I need it to:
        *   Group cards by `cardType`.
        *   Generate an `index.ts` for each `[set]/[cardType]` directory.
        *   Generate a main `[set]/index.ts` that exports from the subdirectories.
3.  **Clean up**: Delete the existing flat set directories (`src/cards/gd01/*.ts` etc.) to avoid duplication, as the new structure will be `src/cards/gd01/[type]/*.ts`.
4.  **Regenerate**: Run the regeneration script to create the new structure.

**Implementation Details for `generateSetIndex`**:
*   Iterate cards to collect unique card types present in the set.
*   For each type:
    *   Filter cards of that type.
    *   Generate `export ... from "./filename"` lines.
    *   Write to `[set]/[type]/index.ts`.
*   Finally, generate `[set]/index.ts` with `export * from "./unit";`, `export * from "./pilot";` etc.

I will start by modifying `file-writer.ts`.
