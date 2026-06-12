# Fix CI Errors

**Automated command to run CI checks, analyze errors, and fix them using intelligent delegation.**

## Usage

Simply invoke this command when you need to fix CI errors across the monorepo.

## What It Does

This command orchestrates a complete CI error resolution workflow:

1. **Run CI Check**: Execute `bun run ci-check` from the repository root
2. **Parse Errors**: Categorize errors by type (lint, type, test) and file
3. **Intelligent Delegation**: 
   - Simple errors (1-3 per file) → Fix inline
   - Complex errors (4+ per file) → Delegate to `ci-fixer` sub-agent
   - Package-wide issues → Delegate entire package to sub-agent
4. **Verify Fixes**: Re-run checks after each batch
5. **Report Results**: Document fixed issues and any unfixable problems

---

## Operational Workflow

### Step 1: Initial Diagnosis

Execute the CI check command from the repository root:

```bash
cd /Users/eduardo.moroni/projects/lorcanito && bun run ci-check
```

This runs `turbo run lint check-types test` which includes:
- **Lint**: Biome linting across all packages
- **Type Check**: TypeScript type validation
- **Tests**: Bun test suite execution

### Step 2: Error Parsing and Categorization

Analyze the output and categorize errors:

#### Lint Errors (Biome)
Pattern: `path/to/file.ts:line:col lint/rule-name ━━━━`
- Extract file path, line number, rule name
- Group by file

#### Type Errors (TypeScript)
Pattern: `path/to/file.ts(line,col): error TSxxxx: message`
- Extract file path, line number, error code
- Group by file and package

#### Test Failures
Pattern: `FAIL path/to/test.ts` or test name assertions
- Extract test file and failing test names
- Group by test file

### Step 3: Intelligent Delegation Decision

For each file with errors, apply this decision matrix:

| Condition | Action |
|-----------|--------|
| 1-3 simple errors in file | Fix inline in main context |
| 4+ errors in single file | Delegate file to `ci-fixer` agent |
| 10+ errors across package | Delegate entire package to `ci-fixer` agent |
| Complex refactoring needed | Delegate to `ci-fixer` agent |
| External dependency issue | Report as unfixable, document workaround |

### Step 4: Inline Fixes (Simple Errors)

For files with 1-3 simple errors:

1. Read the file and understand the context
2. Apply the fix directly
3. Verify with package-specific check:
   ```bash
   bunx turbo lint check-types --filter=@lorcanito/{package}
   ```

### Step 5: Delegated Fixes (Complex Errors)

For complex scenarios, invoke the `ci-fixer` sub-agent:

```
Use the ci-fixer agent to fix errors in {file_path or package_name}

Error context:
- Error type: {lint|type|test}
- Error count: {N}
- Specific errors:
  {list of error messages}
```

The sub-agent will:
- Focus exclusively on the assigned file(s)/package
- Apply fixes following project conventions
- Return results with fixed/unfixable categorization

### Step 6: Verification Loop

After each batch of fixes:

1. Re-run the relevant check:
   ```bash
   # For specific package
   bunx turbo lint check-types test --filter=@lorcanito/{package}
   
   # Or full CI check
   bun run ci-check
   ```

2. If new errors appear:
   - Categorize and add to fix queue
   - Continue iteration

3. If errors persist after 3 attempts:
   - Mark as blocked
   - Document the issue with ⚠️

### Step 7: Final Report

Provide a summary:

```
## CI Fix Results

### Fixed
- ✅ {file}: {error_type} - {description}

### Unfixable (Requires Manual Intervention)
- ⚠️ {file}: {reason}
  Suggested workaround: {suggestion}

### Commands to Verify
bun run ci-check
```

---

## Critical Directives

### Strict Boundaries
- Only modify files within the monorepo
- Respect package boundaries when delegating
- Do not modify external dependencies or node_modules

### Fix Quality Standards
- **No `any` types** - Maintain type safety
- **No eslint-disable or biome-ignore** unless absolutely necessary and documented
- **Prefer proper fixes** over suppressions
- **Follow existing patterns** in the codebase

### Error Type Priorities
1. **Type errors** - Fix first (may resolve downstream issues)
2. **Lint errors** - Fix second (often auto-fixable)
3. **Test failures** - Fix last (may require understanding context)

### Handling External Issues
If an error originates from:
- External package types → Document and suggest local type declaration
- Shared library issues → Report as cross-package dependency
- Configuration issues → Report for manual review

---

## Sub-Agent Delegation Format

When delegating to `ci-fixer`, provide structured context:

```markdown
## Delegation Request

**Target**: {file_path or @lorcanito/package-name}
**Error Type**: {lint | type | test | mixed}
**Error Count**: {N}

### Errors to Fix
1. {error_message_1}
2. {error_message_2}
...

### Constraints
- Only modify files in: {scope}
- Follow patterns from: {similar_files}
- Validation command: {check_command}
```

---

## Success Criteria

The command is complete when:
- ✅ `bun run ci-check` passes with zero errors
- ✅ All fixes follow project conventions
- ✅ No new errors introduced
- ✅ Unfixable issues are documented with clear reasoning

OR

- ⚠️ All fixable errors resolved
- ⚠️ Remaining issues documented with:
  - Root cause explanation
  - Why it cannot be fixed within constraints
  - Suggested manual resolution path

