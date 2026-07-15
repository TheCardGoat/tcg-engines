I will generate the cards again using the new parser logic. Before running the generation script, I will implement one final parser improvement to handle unbracketed costs (e.g., "Rest this Unit:"), which are common in Gundam cards.

### 1. Parser Refinement
- **File**: `packages/gundam-cards/tools/parser/stages/header-extraction.ts`
- **Change**: Add detection for unbracketed costs followed by a colon (e.g., `Rest this Unit：`).
  - This ensures "Rest this Unit" is correctly identified as a `REST_SELF` cost rather than part of the effect description.

### 2. Card Regeneration
- **Command**: `bun packages/gundam-cards/scripts/regenerate-all-from-json.ts`
- **Action**: This script will:
  1. Load raw card data from the scraped JSON files.
  2. Parse the text using the updated `text-parser.ts` pipeline (including segmentation, targeting, and the new cost extraction).
  3. Overwrite the TypeScript card definition files in `src/cards/` with the fully structured data.

### 3. Verification
- I will verify the output by checking `13th-tactical-testing-sector.ts` (which has "Rest this Base：") to confirm the cost is correctly parsed.