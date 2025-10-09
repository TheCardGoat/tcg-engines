# @tcg/core Changelog

All notable changes to the @tcg/core framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Zone Operations Enhancement
- Added `isCardInZone(zone: Zone, cardId: CardId): boolean` for zone membership checks
- Added `addCardToTop(zone: Zone, cardId: CardId): Zone` for ordered zone manipulation
- Added `addCardToBottom(zone: Zone, cardId: CardId): Zone` for ordered zone manipulation
- Added `clearZone(zone: Zone): Zone` for zone reset operations
- Added `findCardInZones(cardId: CardId, zones: Zone[]): Zone | undefined` for multi-zone search
- Added zone state helpers in `zones/zone-state-helpers.ts`:
  - `createPlayerZones<T>(players: PlayerId[], initialValue?: () => T): Record<PlayerId, T>` for flat state patterns
  - `moveCardInState` for immutable state updates across zones
  - `getCardZone` for finding cards in flat zone structures

#### Testing Utilities Package (`@tcg/core/testing`)
- Added `test-engine-builder.ts` with `createTestEngine(definition, players?, options?)` for rapid test setup
- Added `test-player-builder.ts` with `createTestPlayers(count, names?)` for test player creation
- Added `test-state-builder.ts` with `createTestState<T>(overrides?)` for state factories
- Added `test-assertions.ts` with `expectMoveSuccess`, `expectMoveFailure`, `expectStateProperty`
- Added `test-flow-assertions.ts` with `expectPhaseTransition` for game flow testing
- Added `test-end-assertions.ts` with `expectGameEnd` for terminal state validation
- Added `test-card-factory.ts` with `createTestCard(overrides?)` and `createTestCards(count)`
- Added `test-zone-factory.ts` with `createTestZone(config, cards?)` and `createTestDeck`, `createTestHand`
- Added `test-rng-helpers.ts` with `withSeed` and deterministic test utilities
- Added `test-replay-assertions.ts` with `expectDeterministicReplay` for replay verification

#### Card Tooling Foundation (`@tcg/core/tooling`)
- Added abstract `CardParser<TInput, TOutput>` base class for extensible text parsers
- Added abstract `CardGenerator<TCard>` base class for code generation workflows
- Added abstract `CardValidator<TCard>` base class for validation pipelines
- Added `FileWriter` class with `write`, `writeFormatted` methods
- Added `file-utils.ts` with `ensureDirectory`, `createDirectory` utilities
- Added `format-utils.ts` with `formatTypeScript` using Biome
- Added `naming-utils.ts` with `generateVariableName`, `toKebabCase`, `toPascalCase`, `toCamelCase`, `toSnakeCase`

#### Validation Utilities (`@tcg/core/validation`)
- Added `createTypeGuard<T, K, V>(field: K, value: V)` for type guard builder pattern
- Added `isCardOfType` generic helper for card type narrowing
- Added `ValidatorBuilder<T>` class with fluent API (required, type, min, max, custom, build)
- Added `schema-builders.ts` with Zod schema composition utilities

#### Documentation
- Added comprehensive guides in `docs/guides/`:
  - `zone-operations.md` - Complete zone API documentation
  - `testing-utilities.md` - Test builder patterns and TDD workflow
  - `card-tooling.md` - Extension patterns and tutorials
  - `validation.md` - Type guard and validator patterns
- Added runnable examples in `docs/examples/`:
  - `zone-management.ts` - Zone operation examples
  - `test-patterns.ts` - Testing utility examples
  - `card-parser-extension.ts` - CardParser extension example
  - `custom-validator.ts` - ValidatorBuilder usage example

### Changed
- Enhanced `package.json` exports map to include `"./testing"`, `"./tooling"`, and `"./validation"` subpath exports
- Improved zone operations immutability guarantees with comprehensive test coverage (95%+)
- Updated README.md with sections for new utilities and links to guides

### Fixed
- Zone operations now properly maintain card order in ordered zones
- Type safety improved for branded types (CardId, PlayerId, ZoneId) across all utilities

## Previous Versions

See git history for changes prior to this changelog.
