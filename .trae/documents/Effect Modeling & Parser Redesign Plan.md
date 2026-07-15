I will proceed with the **Effect Modeling & Parser Redesign Plan** as outlined.

I will execute the plan in the following order:

### Phase 1: Coverage Validation (Immediate Action)
I will create a script to assess the current parsing quality and identify the most common failure patterns.
1.  **Create Validation Script**: `packages/gundam-cards/tools/coverage/validate-parser-coverage.ts`
    - Load all card definitions from `packages/gundam-cards/src/cards`.
    - Run the current parser on all card texts.
    - Classify results into "Structured", "Partially Structured", and "Fallback (CUSTOM)".
    - Generate a summary report of top unparsed patterns.
2.  **Run Analysis**: Execute the script to establish a baseline.

### Phase 2: Schema Refactor
I will update the core type definitions to support the new requirements.
1.  **Update `card-types.ts`**:
    - Add `EffectRestriction` (e.g., `ONCE_PER_TURN`), `EffectCost`, and `EffectCondition`.
    - Refactor `Effect` to include these first-class fields.
    - Introduce a rich `Action` system (Sequence, Conditional, etc.).
2.  **Update `gundam-target-dsl.ts`**:
    - enhance `TargetQuery` to support controller scoping (enemy/friendly), attribute filters, and counts.

### Phase 3: Parser Refactor
I will rewrite the parser into a multi-stage pipeline.
1.  **Stage 1 - Normalization**: Clean and standardize text.
2.  **Stage 2 - Header Extraction**: Extract timing, costs, and restrictions.
3.  **Stage 3 - Target Detection**: Map text patterns to the new Targeting DSL.
4.  **Stage 4 - Action Mapping**: Map verbs to specific Actions.
5.  **Stage 5 - Assembly**: Construct the final structured Effect object.

### Phase 4: Verification & Cleanup
1.  **Regression Testing**: Ensure no existing structured effects are broken.
2.  **Cleanup**: Remove manual overrides that are now correctly handled by the parser.

I will begin immediately with **Phase 1** to generate the coverage report.