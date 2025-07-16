# Requirements Document

## Introduction

This feature will create a comprehensive system to convert Gundam card import data (JSON format) into properly typed TypeScript card definitions. The system will analyze the current gaps between import data and the improved type system, enhance the TypeScript types based on the Gundam rules, and provide automated conversion tools that organize cards by set with one file per card and one folder per set.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to analyze the current type system gaps so that I can understand what improvements are needed for proper card conversion.

#### Acceptance Criteria

1. WHEN analyzing import data structure THEN the system SHALL identify all fields present in JSON imports that are not properly typed in the current system
2. WHEN comparing with RULES.md THEN the system SHALL identify missing game mechanics that need type representation
3. WHEN reviewing current improved-card-types.ts THEN the system SHALL document gaps in ability modeling, effect representation, and card property typing
4. WHEN analysis is complete THEN the system SHALL provide a comprehensive gap analysis report with specific recommendations

### Requirement 2

**User Story:** As a developer, I want enhanced TypeScript types that accurately represent Gundam card mechanics so that converted cards have proper type safety and game rule compliance.

#### Acceptance Criteria

1. WHEN defining card types THEN the system SHALL support all card types from RULES.md (Unit, Pilot, Command, Base, Resource)
2. WHEN modeling abilities THEN the system SHALL represent all timing keywords (【Main】, 【Action】, 【Deploy】, 【Attack】, 【Destroyed】, 【When Paired】, 【During Pair】, 【Burst】, 【Activate･Main】, 【Activate･Action】)
3. WHEN representing effects THEN the system SHALL model all keyword effects (<Support>, <Blocker>, <High-Maneuver>, <Repair>, <Breach>, <First-Strike>)
4. WHEN typing card properties THEN the system SHALL handle zones (Space, Earth, Space Earth), traits with parentheses notation, link requirements with bracket notation, and rarity variations
5. WHEN processing effect text THEN the system SHALL parse HTML entities, handle multi-line effects, and extract structured ability data

### Requirement 3

**User Story:** As a developer, I want a conversion script that transforms import JSON data into properly typed card definitions so that I can migrate all existing card data efficiently.

#### Acceptance Criteria

1. WHEN running the conversion script THEN the system SHALL read JSON import files from the imports directory
2. WHEN processing each card THEN the system SHALL parse all card properties, extract and structure abilities from effect text, handle special cases like tokens and promotional variants, and validate against the enhanced type system
3. WHEN converting abilities THEN the system SHALL identify timing keywords from effect text, extract target specifications and conditions, parse numerical values and modifiers, and create structured ability objects
4. WHEN handling card variants THEN the system SHALL process promotional versions (p1, p2 suffixes), maintain relationships between base and variant cards, and preserve all unique card data

### Requirement 4

**User Story:** As a developer, I want organized output with one file per card and one folder per set so that the card definitions are maintainable and follow project conventions.

#### Acceptance Criteria

1. WHEN organizing output THEN the system SHALL create one folder per set (ST01, ST02, ST03, GD01, etc.)
2. WHEN creating card files THEN the system SHALL generate one TypeScript file per card with proper naming conventions
3. WHEN structuring directories THEN the system SHALL place files in packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/definitions/{SET}/
4. WHEN generating files THEN the system SHALL include proper imports, export card definitions with consistent naming, and maintain TypeScript strict mode compliance

### Requirement 5

**User Story:** As a developer, I want validation and error handling so that conversion issues are identified and resolved systematically.

#### Acceptance Criteria

1. WHEN validating input data THEN the system SHALL check for required fields, validate data types and formats, and identify malformed or incomplete card data
2. WHEN processing abilities THEN the system SHALL detect unparseable effect text, identify unknown timing keywords, and flag complex abilities requiring manual review
3. WHEN generating output THEN the system SHALL validate TypeScript compilation, check for naming conflicts, and ensure all generated files are syntactically correct
4. WHEN errors occur THEN the system SHALL provide detailed error messages with card identification, log conversion issues for review, and continue processing other cards when possible

### Requirement 6

**User Story:** As a developer, I want the conversion script to be incremental and resumable so that I can process cards efficiently and handle updates to import data.

#### Acceptance Criteria

1. WHEN running conversion THEN the system SHALL support processing single sets or all sets
2. WHEN handling existing files THEN the system SHALL detect already converted cards, provide options to skip or overwrite existing definitions, and preserve manual modifications when requested
3. WHEN processing updates THEN the system SHALL identify changed cards in import data, update only modified definitions, and maintain version tracking for converted cards
4. WHEN resuming conversion THEN the system SHALL continue from the last processed card, handle partial conversion states gracefully, and provide progress reporting