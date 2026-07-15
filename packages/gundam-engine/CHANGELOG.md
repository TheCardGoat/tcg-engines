# @tcg/gundam Changelog

All notable changes to the @tcg/gundam game engine will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Zone Operations Implementation
- Added complete zone operations module in `src/zones/zone-operations.ts`:
  - `createDeckZone(playerId, cards)` - Creates main deck zone (50 cards)
  - `createResourceDeckZone(playerId, cards)` - Creates resource deck zone (10 cards)
  - `createHandZone(playerId, cards)` - Creates hand zone (max 10 cards)
  - `createBattleAreaZone(playerId, cards)` - Creates battle area (max 6 units)
  - `createShieldSectionZone(playerId, cards)` - Creates shield section (6 shields at start)
  - `createBaseSectionZone(playerId, baseCard)` - Creates base section (max 1 base)
  - `createResourceAreaZone(playerId, cards)` - Creates resource area (max 15 resources)
  - `createTrashZone(playerId, cards)` - Creates trash zone
  - `createRemovalZone(playerId, cards)` - Creates removal zone
  - `createPlayerZones(playerId)` - Creates all zones for a player
- Added game-specific zone operations:
  - `drawCards(deck, hand, count)` - Draw cards from deck
  - `shuffleDeck(deck, seed)` - Deterministic shuffle
  - `deployUnit(hand, battleArea, cardId)` - Deploy unit to battle
  - `placeResource(hand, resourceArea, cardId)` - Place resource
  - `destroyUnit(battleArea, trash, cardId)` - Move unit to trash
  - `takeDamage(shieldSection, trash, damage)` - Remove shields
  - `removeFromGame(sourceZone, removal, cardId)` - Remove card from game
- Re-exported commonly used core operations for convenience

#### Testing Infrastructure
- Added comprehensive zone operation tests in `src/zones/__tests__/zone-operations.test.ts` (30 tests):
  - Tests for all 9 Gundam zone types with proper configuration
  - Tests for zone capacity limits (hand: 10, battle: 6, base: 1, resources: 15)
  - Tests for zone visibility rules (secret, private, public)
  - Tests for multi-zone operations and complex game scenarios
  - Tests for zone immutability guarantees
- Added test suite using @tcg/core/testing utilities in `src/__tests__/zone-helpers.test.ts` (18 tests):
  - Demonstrates proper usage of `createTestCard`, `createTestCards`, `resetCardCounter`
  - Tests for game flow scenarios (draw, deploy, resource placement, combat)
  - Tests for edge cases (capacity limits, damage handling)

#### Card Type Guards
- Migrated type guards to use `@tcg/core/validation` utilities:
  - `isUnitCard` - Using `createTypeGuard<CardDefinition, "cardType", "UNIT">`
  - `isPilotCard` - Using `createTypeGuard<CardDefinition, "cardType", "PILOT">`
  - `isCommandCard` - Using `createTypeGuard<CardDefinition, "cardType", "COMMAND">`
  - `isBaseCard` - Using `createTypeGuard<CardDefinition, "cardType", "BASE">`
  - `isResourceCard` - Using `createTypeGuard<CardDefinition, "cardType", "RESOURCE">`

#### Documentation
- Added comprehensive zone and testing guide: `docs/zones-and-testing.md`
  - Complete Gundam zone structure documentation
  - Zone operation API reference with examples
  - Testing patterns using @tcg/core/testing
  - Integration with @tcg/core best practices
  - Migration guide from custom implementations

### Changed
- Updated `src/zones/index.ts` to export all zone operations
- Improved test coverage to 49 passing tests (25 todo tests for future features)
- All zone operations now use immutable patterns from @tcg/core
- Type safety enhanced with proper branded type handling (CardId, PlayerId, ZoneId)

### Performance
- Zone operations use optimized @tcg/core implementations
- Deterministic shuffle with seeded RNG for replay capability
- All tests pass with no performance regressions

### Fixed
- Resolved linter issues (3 minor warnings remaining, non-critical)
- Fixed type safety across all zone operations
- Proper handling of zone configuration (using `zone.config.X` pattern)

## Previous Versions

See git history for changes prior to this changelog.
