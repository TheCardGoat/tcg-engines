# Memory Bank

The Memory Bank is a development log system for AI-assisted contributions. It serves as the single source of truth for planning, decision-making, and progress tracking during feature development.

## Purpose

1. **Transparency** - Document reasoning and decisions for maintainer review
2. **Steering** - Enable early feedback on approach before code is written
3. **Continuity** - Preserve context across AI sessions and contributors
4. **Quality** - Ensure thorough planning before implementation

## How to Use

### Starting a New Feature

1. Create a new file: `.ai_memory/<feature-branch-name>.md`
2. Copy the structure from `TEMPLATE.md`
3. Fill in the **Context** and **Problem Statement** sections
4. Research the codebase and document findings in **Research & Analysis**

### The Steering PR

Before writing implementation code:

1. Complete the **Proposed Solution** section in your Memory Bank log
2. Open a Pull Request containing **only** the Memory Bank file
3. Request maintainer review on your approach
4. Iterate based on feedback before proceeding

### During Implementation

1. Update the **Implementation Log** as you work
2. Check off items in the **Review Checklist** (The Gauntlet)
3. Update **Status** to track overall progress

## File Naming

Use the feature branch name for your Memory Bank file:

```
.ai_memory/
├── README.md           # This file
├── TEMPLATE.md         # Copy this for new features
├── add-dark-mode.md    # Example: feature/add-dark-mode
├── fix-auth-bug.md     # Example: fix/auth-bug
└── refactor-zones.md   # Example: refactor/zones
```

## Integration with Workflow

The Memory Bank integrates with the project's AI-First contribution workflow:

1. **Phase 1: Plan** - Create and populate Memory Bank log
2. **Phase 2: Steering PR** - Submit log for review
3. **Phase 3: Implementation** - Execute plan, update log
4. **Phase 4: The Gauntlet** - AI review via 3 specialized agents

## Related Resources

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Full contribution guidelines
- [Development Process](../agent-os/product/development-process.md) - Development philosophy
- [Code Style](../.claude/rules/code-style.md) - Coding standards
