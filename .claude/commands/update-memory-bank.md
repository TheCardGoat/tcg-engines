# Update Memory Bank

You are tasked with creating or updating a Memory Bank log for the current task or feature.

## Purpose

The Memory Bank is the development log system for AI-First contributions. It ensures:
- Planning happens before implementation
- Decisions are documented for review
- Progress is tracked consistently
- Context is preserved across sessions

## Process - FOLLOW STRICTLY IN ORDER

### Step 1: Identify the Task

Determine what needs to be logged:
- What is the feature/task being worked on?
- What is the git branch name?
- Are there related issues?

If no branch exists yet, ask the user what to name the log file.

### Step 2: Check for Existing Log

Look for an existing Memory Bank log:

```bash
ls -la .ai_memory/
```

If a log exists for this branch/feature, read it to understand the current state.

### Step 3: Create or Update the Log

**If creating new:**
1. Copy the template: `.ai_memory/TEMPLATE.md`
2. Create file: `.ai_memory/<branch-name>.md`
3. Fill in all sections

**If updating existing:**
1. Read the current log
2. Update the relevant sections
3. Add entries to Implementation Log

### Step 4: Required Sections

Ensure these sections are complete:

#### Context (Required for new logs)
```markdown
## Context
| Field | Value |
|-------|-------|
| **Date Started** | YYYY-MM-DD |
| **Branch** | `feature/branch-name` |
| **Related Issues** | #123 |
| **Author** | @username or AI Agent |
```

#### Problem Statement (Required for new logs)
```markdown
## Problem Statement
[Clear description of what needs to be solved]
```

#### Research & Analysis (Fill during exploration)
```markdown
## Research & Analysis
[Notes from codebase exploration]

### Key Files
| File | Relevance |
|------|-----------|
```

#### Proposed Solution (Required before implementation)
```markdown
## Proposed Solution

### Approach
[High-level strategy]

### Files to Modify
| File | Changes |
|------|---------|

### Alternatives Considered
| Option | Pros | Cons | Decision |
```

#### Implementation Log (Update during work)
```markdown
## Implementation Log

### YYYY-MM-DD
- [ ] Step 1
- [x] Step 2 (completed)
```

#### Review Checklist (Check before PR)
```markdown
## Review Checklist (The Gauntlet)

### Style (Linter Agent)
- [ ] No `any` types
- [ ] Proper import ordering
- [ ] Biome formatting applied

### Logic (Analyst Agent)
- [ ] Game rules correctly implemented
- [ ] Edge cases handled
- [ ] Tests cover scenarios

### Architecture (Tech Lead Agent)
- [ ] No code duplication
- [ ] Correct layer placement
- [ ] Immutable state via Immer
```

### Step 5: Validation

Before completing, verify:
- [ ] All required sections have content
- [ ] Problem Statement is clear
- [ ] Proposed Solution has concrete steps
- [ ] Files to Modify list is complete

### Step 6: Report Summary

After updating, report:
```
Memory Bank Updated
==================
File: .ai_memory/<name>.md

Sections Updated:
- [x] Context
- [x] Problem Statement
- [ ] Research (pending exploration)
- [ ] Proposed Solution (pending planning)

Next Steps:
- Complete [section] before proceeding
- Consider Steering PR if complex feature
```

## Important Rules

1. **ALWAYS LOG FIRST**: Never implement without a Memory Bank entry

2. **BE SPECIFIC**: Vague logs don't help. Include file paths, function names, specific decisions.

3. **UPDATE INCREMENTALLY**: Add to Implementation Log as you work, not all at once.

4. **CHECK THE GAUNTLET**: Use the Review Checklist before any PR.

5. **STEERING PRs**: For complex features, suggest submitting a plan-only PR before implementation.

## Template Location

The template is at: `.ai_memory/TEMPLATE.md`

## Example Log File

```markdown
# Add Dark Mode Toggle

## Context
| Field | Value |
|-------|-------|
| **Date Started** | 2025-01-15 |
| **Branch** | `feature/dark-mode` |
| **Related Issues** | #42 |

## Problem Statement
Users want to switch between light and dark themes...

## Research & Analysis
Found existing theme utilities in `src/lib/theme.ts`...

## Proposed Solution
### Approach
1. Add theme context provider
2. Create toggle component
3. Persist preference to localStorage

### Files to Modify
| File | Changes |
|------|---------|
| `src/lib/theme.ts` | Add dark mode colors |
| `src/components/ThemeToggle.svelte` | New component |
```

## Getting Started

Begin by checking for existing logs in `.ai_memory/` and identifying the current task.
