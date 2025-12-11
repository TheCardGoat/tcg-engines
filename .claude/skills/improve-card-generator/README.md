# Improve Card Generator Skill

## Overview

This skill helps you incrementally improve the Lorcana card generator by identifying missing cards, fixing the parser/generator logic, and verifying the results.

## Quick Start

To start improving the generator, say:
> "Improve card generator"

The skill will:
1.  Run the missing cards report to identify gaps.
2.  Help you select a card or pattern to fix.
3.  Guide you through debugging the parser.
4.  Verify the fix.

## File Structure

```
.claude/skills/improve-card-generator/
├── SKILLS.md              # Main skill definition
├── README.md              # This file
└── examples/              # Helper scripts
    └── debug-parser.ts    # Script to debug parsing of specific text
```

## Workflow

1.  **Diagnose**: Find out which cards are failing to generate.
2.  **Debug**: Isolate the specific text causing the failure.
3.  **Fix**: Update `packages/lorcana-cards/src/parser/` or related files.
4.  **Verify**: Ensure the card generates correctly and no regressions occur.
