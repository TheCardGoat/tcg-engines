# Spec Requirements Document

> Spec: Gundam Engine Rules Documentation Restructure
> Created: 2025-10-11

## Overview

Restructure the comprehensive 1,145-line RULES.md file into a three-tier progressive disclosure documentation system optimized for LLM consumption. This will reduce context bloat while maintaining complete rule accuracy, enabling LLM agents to efficiently navigate and load only the specific rules they need at appropriate detail levels.

## User Stories

### LLM Agent Implementing Card Mechanics

As an LLM agent implementing a specific card mechanic, I want to quickly locate and understand only the relevant rules for that mechanic, so that I can generate accurate code without loading the entire 1,145-line rulebook into my context.

The agent starts at INDEX.md, identifies the relevant section (e.g., "11. Keyword Effects and Keywords"), loads the light.md summary to understand the basic concept, then drills down to the specific keyword-effects.md file to get complete implementation details for <Blocker> or 【Deploy】. This progressive approach minimizes token usage while ensuring accuracy.

### LLM Agent Debugging Game State Issues

As an LLM agent debugging a game state issue, I want to navigate directly to specific rule subsections using cross-references, so that I can verify the correct behavior without reading through unrelated rules.

When investigating why damage isn't being applied correctly, the agent uses KEYWORDS-INDEX.md to quickly jump to "damage" which links to the damage-step.md file in the attacking-and-battles section. All cross-references are converted to working markdown links, allowing immediate navigation to referenced rules like "See 7-6. Damage Step" without manual searching.

### Developer Onboarding to Gundam Engine Rules

As a developer new to the Gundam TCG engine, I want to progressively learn the rules starting from high-level concepts before diving into detailed edge cases, so that I can build understanding incrementally rather than being overwhelmed by comprehensive legal text.

The developer begins with INDEX.md which provides a 1-2 sentence overview of each major rule section. They then explore light.md files for sections relevant to their current task, loading full.md files only when implementation requires precise rule interpretation. This structured approach prevents information overload while ensuring access to authoritative rule details when needed.

## Spec Scope

1. **Three-Tier Progressive Disclosure System** - Create INDEX.md as entry point, light.md summaries for each section, and full.md files with complete rule details, organized in a hierarchical folder structure.

2. **Section Breakdown and Organization** - Split the 11 main rule sections into logical folders (01-game-overview through 11-keyword-effects-and-keywords), with complex sections further subdivided into specific topic files.

3. **Keyword Quick-Lookup Index** - Create KEYWORDS-INDEX.md with alphabetical listings of all keyword effects (<Repair>, <Blocker>, etc.) and keywords (【Deploy】, 【Burst】, etc.) with direct links to detailed explanations.

4. **Cross-Reference Conversion** - Convert all internal numeric references (e.g., "See 7-6. Damage Step") to functional markdown links pointing to specific files and section anchors for seamless navigation.

5. **File Organization and Naming Conventions** - Establish clear folder structure (docs/rules/##-section-name/) and consistent file naming (light.md, full.md, descriptive subsection names) for maintainability.

## Out of Scope

- Code changes to the Gundam engine implementation
- Rule interpretations, clarifications, or modifications beyond what exists in the original RULES.md
- Visual design, diagrams, or formatting beyond standard markdown structure
- Integration with the game engine codebase or automated rule validation
- Multiplayer rules documentation (separate from comprehensive rules)
- Tournament or competitive play guidelines
- Modification or deletion of the original RULES.md file (preserved as reference)
- Auto-generation tools or build processes for documentation

## Expected Deliverable

1. **Complete three-tier documentation structure** at packages/gundam-engine/docs/rules/ with INDEX.md serving as the main entry point, all 11 sections split into light.md and full.md files, and complex sections appropriately subdivided.

2. **KEYWORDS-INDEX.md** providing quick-lookup capability for all 6 keyword effects and 12 keywords with direct links to detailed explanations in their respective section files.

3. **All cross-references converted** to functional markdown links, enabling LLM agents to navigate between related rules by clicking references rather than manually searching, verified across all documentation files.
