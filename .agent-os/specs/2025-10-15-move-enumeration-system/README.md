# Move Enumeration System

**Spec ID**: 2025-10-15-move-enumeration-system  
**Status**: 🟡 Requirements Gathered - Ready for Implementation  
**Target**: `packages/core`  
**Breaking Changes**: Yes (acceptable)

## Quick Links

- [📋 Full Specification](./spec.md) - Complete technical specification
- [📝 Spec Lite](./spec-lite.md) - High-level overview
- [✅ Tasks](./tasks.md) - Implementation task breakdown
- [📊 Requirements Summary](./planning/requirements-summary.md) - Key decisions
- [📖 Initial Context](./planning/initial-context.md) - Background and gap analysis

## Overview

Implements a comprehensive move enumeration system that enables AI agents and UI components to discover available moves and their valid parameters at any game state. This will be a core API feature of `@tcg/core`.

## Key Features

✅ Single comprehensive `enumerateMoves()` API  
✅ Explicit parameter enumeration per move  
✅ Support for all parameter types (cards, targets, numbers, enums)  
✅ Type-safe with TypeScript inference  
✅ Seamless RuleEngine integration  
✅ Simple developer workflow  

## Timeline

**Estimated**: 2-3 weeks

- Week 1: Core implementation & basic testing
- Week 2: Advanced testing & documentation
- Week 3: Integration with real games & polish

## Getting Started

Read the [Full Specification](./spec.md) for complete details, then proceed with [Tasks](./tasks.md) for implementation.

## Questions?

See [Requirements Summary](./planning/requirements-summary.md) for key decisions and rationale.



