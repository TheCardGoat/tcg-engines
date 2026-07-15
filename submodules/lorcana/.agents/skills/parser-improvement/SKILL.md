---
name: parser-improvement
description: Compatibility entrypoint for Lorcana parser and card-generation work. Routes missingImplementation and generator failures to improve-card-generator.
---

# Parser Improvement

Use [`improve-card-generator`](../improve-card-generator/SKILL.md) as the
canonical workflow. Historical V1/V2 pattern guides in this skill were removed
because they referenced parser directories, helper agents, and regeneration
flags that are not present in the current workspace.
