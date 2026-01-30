I will refactor `target-parser.ts` to use the new `CardTarget` DSL.

**Key Changes:**
1.  **Update Imports**: Replace imports from `@tcg/gundam-types` to use the new types (`CardTarget`, `UnitTarget`, `UnitFilter`, `TargetZone`, `ComparisonOperator`, etc.).
2.  **Update `TargetParseResult`**: Change the `query` field to `CardTarget | CardTarget[]`.
3.  **Refactor `parseTargetDescription`**:
    *   Return `UnitFilter[]` instead of `GundamFilter[]`.
    *   Map `controller` ("SELF"/"OPPONENT") to `owner` ("you"/"opponent").
    *   Map `zone` to `TargetZone` ("trashArea" -> "trashArea", "handArea" -> "hand").
    *   Map specific filters:
        *   `HP/AP/Cost` comparisons -> `{ type: "X-comparison", comparison: "less-or-equal", value: V }`.
        *   `damaged` -> `{ type: "damaged" }`.
        *   `rested`/`exerted` -> `{ type: "rested" }`.
        *   `active`/`stand mode` -> `{ type: "active" }`.
4.  **Refactor `parseTarget`**:
    *   Map "Choose X" patterns to `ExactCountUnitQuery` or `UpToCountUnitQuery`.
    *   Map "All" patterns to `AllMatchingUnitQuery`.
    *   Construct the `UnitTarget` object with `selector`, `owner`, `filters`, `zone`, and `count`.

**Note on Card Types**: The new `CardTarget` DSL primarily defines `UnitTarget`. I will map the parsing logic to produce `UnitTarget` structures. If the text specifies "Pilot" or "Base", I will still produce the structure (as it's the only available complex query type) but strictly speaking, `UnitTarget` implies units. I will prioritize a correct structural migration.
