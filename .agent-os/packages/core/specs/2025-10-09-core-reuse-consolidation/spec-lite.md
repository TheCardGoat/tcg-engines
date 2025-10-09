# Spec Summary (Lite)

Consolidate duplicated functionality from gundam-engine and lorcana-engine into @tcg/core framework. Specifically: (1) unify zone operations API currently duplicated across games, (2) extract reusable testing utilities from core integration tests into `@tcg/core/testing`, (3) create card tooling foundation in `@tcg/core/tooling` that games can extend. This reduces code duplication, ensures consistency, and simplifies game development by providing battle-tested utilities for common patterns.

