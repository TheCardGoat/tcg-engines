# @tcg/lorcana Changelog

All notable changes to the @tcg/lorcana game engine will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

#### Zone Operations Migration to @tcg/core
- **BREAKING**: Migrated zone operations to use `@tcg/core` utilities
  - Replaced custom `zone-operations.ts` implementations with core imports
  - Now using `createZone`, `addCard`, `removeCard`, `moveCard`, `shuffle`, `draw` from @tcg/core
  - Zone operations now export aliased functions to avoid naming conflicts with flat ZoneState helpers
- Updated all zone operation call sites across the engine to use @tcg/core API
- Removed duplicate zone operation code (~200 lines eliminated)
- Zone operations now have consistent immutability guarantees with other @tcg games

#### Testing Improvements
- Added comprehensive tests verifying lorcana zone operations work with core utilities
- Created integration tests in `game-definition/__tests__/core-zone-integration.test.ts`
- Added zone operations tests in `game-definition/__tests__/zone-operations.test.ts`
- All existing tests continue to pass (71 tests, 124 assertions)

#### Documentation
- Added migration guide: `docs/migration-to-core-zones.md`
- Documented before/after examples for common zone operations
- Added best practices for working with @tcg/core zones in Lorcana context

### Performance
- Zone operations maintain equivalent or improved performance vs previous implementation
- No measurable performance regression in test execution time

### Fixed
- Improved type safety for zone operations with proper branded type handling
- Fixed zone property access patterns (using `zone.config.X` instead of `zone.X`)

## Previous Versions

See git history for changes prior to this changelog.
