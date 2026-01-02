---
description: "The Gauntlet review process. Apply when completing implementation or preparing for PR submission."
alwaysApply: false
---

# The Gauntlet: 3-Agent Review

Before submitting a PR, your code will be reviewed by three specialized AI agents. Pre-empt their feedback for a smooth merge.

## Agent 1: The Linter (Style)

**Focus:** Coding standards, formatting, TypeScript compliance

**Checks:**
- [ ] No `any` types
- [ ] Proper import ordering (type → external → internal → relative)
- [ ] Naming conventions followed
- [ ] No unused variables/imports
- [ ] Biome formatting applied

**Invoke:** `gauntlet-linter` agent

## Agent 2: The Business Analyst (Logic)

**Focus:** Game rules, domain correctness, calculations

**Checks:**
- [ ] Game rules correctly implemented
- [ ] Owner vs Controller used correctly
- [ ] Zone transitions follow TCG rules
- [ ] Ability timing correct
- [ ] Calculations accurate

**Invoke:** `gauntlet-analyst` agent

## Agent 3: The Tech Lead (Architecture)

**Focus:** Architecture, code reuse, performance

**Checks:**
- [ ] Code in correct layer (core vs game engine)
- [ ] No unnecessary duplication
- [ ] State changes via Immer
- [ ] Performant implementation
- [ ] Proper separation of concerns

**Invoke:** `gauntlet-tech-lead` agent

## Pre-Submission Checklist

```bash
# Run all checks
bun run format       # Format code
bun run check-types  # TypeScript check
bun test             # Run tests
bun run lint         # Lint check
```

## Reference
- Agents: `.claude/agents/gauntlet-*.md`
- Standards: `.claude/rules/`
