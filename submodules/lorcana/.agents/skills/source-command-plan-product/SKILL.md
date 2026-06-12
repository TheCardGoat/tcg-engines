---
name: "source-command-plan-product"
description: "Run the migrated source command `plan-product`."
---

# source-command-plan-product

Use this skill when the user asks to run the migrated source command `plan-product`.

## Command Template

# Plan Product

Plan a new product and install Agent OS in its codebase.

Refer to the instructions located in this file:
@.agent-os/instructions/core/plan-product.md

## MANUAL MIGRATION REQUIRED

Migrated from source command `plan-product` into a Codex skill. Invoke it as `$source-command-plan-product` and manually rewrite any slash-command behavior that depended on provider-specific runtime expansion.

Provider automatic file-reference expansion was preserved as text; verify Codex should read those files explicitly.
