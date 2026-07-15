I will remove the `effects` property from all card definition files in `packages/gundam-cards/src/cards`.

**Plan:**
1.  **Search**: Use `grep` to find all TypeScript files in `packages/gundam-cards/src/cards` that contain the `effects` property.
2.  **Modify**: Iterate through each file and remove the `effects` array property from the card definition object. I will use `sed` or a similar text processing approach via `RunCommand` to perform this bulk edit efficiently, ensuring I only target the `effects` property within the object literal.
    *   *Refinement*: Since `sed` can be risky with multi-line structures, I will use a small temporary Node.js script to parse, modify, and save the files, or I will use `SearchReplace` if the number of files is manageable. Given the large number of files (200+), a script is safer and more reliable.
3.  **Verify**: Check a few files to ensure the `effects` property is gone and the file syntax remains valid.

**Script Approach:**
I will create a temporary script `scripts/remove-effects.ts` that:
1.  Globs all `src/cards/**/*.ts` files.
2.  Reads each file.
3.  Removes the `effects: [...]` block.
4.  Writes the file back.

This avoids the complexity of `sed` regex on multi-line JSON-like structures.
