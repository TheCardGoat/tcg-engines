# Migration Workflow

This document defines the autonomous card-by-card migration workflow for Set 007 action cards.

> Version: 2.0.0
> Last Updated: 2025-10-05

## Overview

This workflow guides making all Set 007 action card tests pass. The action cards already exist in the new project - we only need to: (1) copy missing dependency cards from old project, (2) implement framework features to make tests pass.

## Phase 1: Dependency Card Migration

### Step 0: Identify All Missing Dependency Cards

**Action:** Scan all 007 action card tests and identify which character/item cards need to be copied

**Process:**
1. Read all test files in `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/*.test.ts`
2. Extract all card imports (e.g., `hiramFlavershamToymaker`, `tipoGrowingSon`)
3. Identify which set each card belongs to (002, 005, etc.)
4. Check if card exists in new project structure
5. Create list of missing cards that need to be copied

**Checklist:**
- [ ] All 007 action test files scanned
- [ ] All imported character/item cards identified
- [ ] Set numbers determined for each card
- [ ] Missing cards list created (cards in old project but not new)
- [ ] Existing cards list created (already migrated, skip these)

**Output:** Complete list of missing dependency cards to migrate

---

### Step 0b: Copy All Missing Dependency Cards

**Action:** For each missing card, copy from old project to new project with full abilities

**Process:**
1. For each missing card in list:
   - Locate in old project: `packages/lorcana-engine/src/cards/[set]/characters/` or `items/`
   - Read full card definition including all abilities
   - Create target file: `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/[set]/characters/[number]-[name].ts`
   - Migrate card to new format
   - Update ability/effect imports to new framework
   - Add export to set index file

**Checklist:**
- [ ] All missing cards located in old project
- [ ] Full definitions copied (not stubs)
- [ ] Card files created in correct set folders
- [ ] Abilities/effects migrated to new format
- [ ] Imports updated to new framework paths
- [ ] Cards exported from set index files

**CRITICAL:** Copy FULL card definitions with ALL abilities - NO minimal stubs

**Output:** All dependency cards migrated and ready for use in tests

---

## Phase 2: Framework Implementation

### Step 1: Select Next Action Card Test

**Action:** Select the next 007 action card test to make pass

**Process:**
1. List all tests in `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/`
2. Check which tests already pass
3. Select next failing test in numerical order

**Checklist:**
- [ ] Test list generated
- [ ] Passing tests identified
- [ ] Next failing test selected

**NOTE:** The action cards already exist - we're NOT migrating them, only making their tests pass

---

### Step 2: Run Test

**Action:** Execute the test file to identify framework gaps

**Command:**
```bash
bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/[number]-[name].test.ts
```

**Process:**
1. Run test command
2. Analyze error messages
3. Identify missing framework features
4. Document what needs to be implemented

**Checklist:**
- [ ] Test executed
- [ ] Error messages analyzed
- [ ] Framework gaps identified
- [ ] Implementation plan created

---

### Step 3: Implement Framework Features

**Action:** Add missing framework capabilities in production-ready manner

**Process:**
1. For each missing feature identified in test failure:
   - Write failing test first if needed (TDD Red phase)
   - Implement minimum code to pass (TDD Green phase)
   - Refactor for quality (TDD Refactor phase)
2. No temporary workarounds or simplified versions
3. Production-quality code only
4. Follow TypeScript strict mode requirements

**Checklist:**
- [ ] All missing features identified from test errors
- [ ] Features implemented production-ready
- [ ] Code follows quality standards
- [ ] TypeScript types correct

---

### Step 4: Verify Test Passes

**Action:** Confirm the action card test now passes

**Command:**
```bash
bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/[number]-[name].test.ts
```

**Process:**
1. Run test again
2. Confirm green status (all assertions pass)
3. Verify type checking passes
4. Check for any warnings

**Checklist:**
- [ ] Test passes (green)
- [ ] Type checking passes
- [ ] No warnings
- [ ] Framework features properly implemented

**Success Criteria:**
- ✅ Test file passes without errors
- ✅ TypeScript types are correct
- ✅ Real dependency cards used (no mocks)
- ✅ Framework features production-ready

---

### Step 5: Move to Next Test

**Action:** Automatically proceed to the next failing test

**Process:**
1. Mark current test as completed
2. Return to Step 1 to select next failing test
3. Continue autonomously through all set 007 action card tests

**Only Request Human Help If:**
- Genuinely stuck on very complex issue after multiple attempts
- Architectural decision needed beyond current scope
- Multiple approaches tried without success

**Checklist:**
- [ ] Current test marked complete
- [ ] Ready to proceed to next test
- [ ] OR human help needed (explain why)

---

## Final Validation (After All Cards)

**Action:** Run complete test suite for set 007 actions

**Command:**
```bash
bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/
```

**Process:**
1. Execute all set 007 action tests
2. Verify all tests pass
3. Check for any type errors
4. Review migration completeness

**Success Criteria:**
- ✅ All set 007 action tests pass
- ✅ All dependency cards migrated with full definitions
- ✅ Framework features implemented production-ready
- ✅ No minimal stubs used
- ✅ Type checking passes for all files
