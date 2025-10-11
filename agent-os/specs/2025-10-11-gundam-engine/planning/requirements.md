# Spec Requirements: Gundam Engine Rules Documentation

## Initial Description
**Target Directory/Package**: packages/gundam-engine

**Context**: This is for the Gundam TCG engine within a monorepo that contains multiple card game engines (including Lorcana and Gundam). The gundam-engine package is located at packages/engines/core-engine/src/game-engine/engines/gundam/

**Goal**: Restructure the comprehensive RULES.md file (currently 1,145 lines) to make it more navigable and digestible for LLM agents, reducing context bloat while maintaining all rule content accuracy.

## Requirements Discussion

### First Round Questions

**Q1:** For navigation structure, I was thinking of a three-tier progressive disclosure system where each rules section has multiple levels of detail (e.g., summary -> intermediate -> full). Would you prefer:
- A hierarchical folder structure (sections/attacking/, sections/effects/, etc.)
- A flat structure with clear naming conventions (rules-attacking-summary.md, rules-attacking-full.md)
- An index-based approach where INDEX.md links to each section's light version, which then links to full content?

**Answer:** Three-tier progressive disclosure system optimized for LLMs:
- **INDEX.md** (always the entry point for prompts) - Very brief explanation of each rules section + link to light version
- **Light version** of each segment - Digestible piece of information + link to full content
- **Full content** - Complete detailed rules (for when higher fidelity is required)

**Q2:** Regarding the granularity of the breakdown, should we:
- Split the 11 main sections into separate files as-is
- Further subdivide complex sections (like "7. Attacking and Battles" which has 7 subsections) into multiple files
- Use your best judgment based on keeping each file under a certain line/token count?

**Answer:** Use best judgment based on the 1,145-line RULES.md structure. User suggests: 11 main sections as base, with further subsection breakdown for complex sections like "Attacking and Battles."

**Q3:** For LLM consumption, I assume we're optimizing for context token budget. Are we:
- Working with a very low budget (need extremely small files, ~200-300 lines max)
- Moderate budget (files can be ~500-800 lines)
- Not particularly constrained (focus on logical groupings over size)?

**Answer:** Not running on a very low budget, so we can be more generous with content per file.

**Q4:** Should the light/summary versions be:
- Auto-generated excerpts (first paragraph of each subsection)
- Hand-crafted summaries that you'll provide
- Structured as bullet-point lists of key concepts with references to full sections?

**Answer:** Progressive detail levels (summary -> intermediate -> full) with different files that can be fully read. This implies structured summaries rather than auto-generated excerpts.

**Q5:** For cross-references within rules (e.g., "See 7-6. Damage Step"), should we:
- Convert these to relative file paths/anchors for easy navigation
- Keep the numeric references but add markdown links
- Create a mapping document that LLMs can use to locate referenced sections?

**Answer:** Convert internal references (e.g., "See 7-6. Damage Step") to file/section paths for easy navigation.

**Q6:** Should we create a quick-lookup index for keywords and effects (like <Blocker>, 【Deploy】, etc.) that LLMs might need to reference frequently without reading through entire sections?

**Answer:** YES - Create a quick-lookup index for keywords and effects (like <Blocker>, 【Deploy】, etc.) so LLMs can quickly jump to relevant detailed sections without reading everything.

**Q7:** For the 11 main sections, should any be merged or further split based on logical grouping? For example:
- "2. Card Information" is quite detailed - should it be split by card type?
- "11. Keyword Effects and Keywords" might warrant separation into two distinct sections?

**Answer:** Implicit in the best judgment answer - we'll evaluate each section independently based on content density and logical cohesion.

**Q8:** Should the documentation format:
- Maintain the current comprehensive rulebook style (formal, legal-style language)
- Be simplified/streamlined for easier LLM parsing
- Include both versions (formal + simplified)?

**Answer:** Maintain all rule content accuracy. This implies keeping the formal comprehensive rules intact while adding progressive disclosure layers on top.

**Q9:** What should NOT be included in this documentation restructuring? For example:
- No code generation or engine implementation changes
- No modification of rule content or interpretations
- No removal of any existing rule details?

**Answer:** This is a documentation-only spec (no code changes). Maintain all rule content accuracy while improving accessibility.

### Existing Code to Reference

**Similar Features Identified:**
No similar existing features were identified for reference, as this is purely a documentation restructuring task with no code implementation component.

### Follow-up Questions

No follow-up questions were asked, as the user's answers provided comprehensive guidance for all aspects of the documentation restructuring.

## Visual Assets

### Files Provided:
No visual files found in the visuals folder.

### Visual Insights:
N/A - This is a documentation restructuring specification with no visual design components.

## Requirements Summary

### Functional Requirements

**Core Documentation Structure:**
1. **Three-Tier Progressive Disclosure System:**
   - Tier 1: INDEX.md - Entry point with very brief explanations + links to light versions
   - Tier 2: Light versions - Digestible summaries with links to full content
   - Tier 3: Full content - Complete detailed rules from original RULES.md

2. **Section Breakdown:**
   - Base structure: 11 main sections as separate file groups
   - Complex sections (e.g., "7. Attacking and Battles") further subdivided into logical subsections
   - Evaluate each section independently for optimal granularity
   - No strict line/token limits, but files should be reasonably sized for LLM consumption

3. **Cross-Reference Conversion:**
   - Convert numeric references (e.g., "See 7-6. Damage Step") to file paths/section anchors
   - Maintain reference accuracy while improving navigation
   - Enable direct jumping between related sections

4. **Keyword/Effect Quick-Lookup Index:**
   - Create searchable index for frequently referenced terms
   - Include all keyword effects: <Repair>, <Breach>, <Support>, <Blocker>, <First Strike>, <High-Maneuver>
   - Include all keywords: 【Activate・Main】, 【Activate・Action】, 【Main】, 【Action】, 【Burst】, 【Deploy】, 【Attack】, 【Destroyed】, 【When Paired】, 【During Pair】, 【Pilot】, 【Once per Turn】
   - Enable LLMs to quickly locate detailed explanations without reading entire sections

5. **Content Preservation:**
   - Maintain ALL existing rule content from RULES.md
   - Preserve formal comprehensive rulebook language
   - No rule interpretations or modifications
   - Ensure accuracy across all documentation tiers

### File Organization Strategy

**Proposed Structure:**
```
packages/gundam-engine/
├── RULES.md (keep original for reference)
├── docs/
│   └── rules/
│       ├── INDEX.md (Tier 1 - Main entry point)
│       ├── KEYWORDS-INDEX.md (Quick-lookup for keywords/effects)
│       │
│       ├── 01-game-overview/
│       │   ├── light.md (Tier 2 summary)
│       │   └── full.md (Tier 3 complete details)
│       │
│       ├── 02-card-information/
│       │   ├── light.md
│       │   ├── full.md
│       │   └── [possibly subdivided by card type if needed]
│       │
│       ├── 03-game-locations/
│       │   ├── light.md
│       │   └── full.md
│       │
│       ├── 04-essential-terminology/
│       │   ├── light.md
│       │   └── full.md
│       │
│       ├── 05-preparing-to-play/
│       │   ├── light.md
│       │   └── full.md
│       │
│       ├── 06-game-progression/
│       │   ├── light.md
│       │   ├── full.md
│       │   └── [possibly subdivided by phase]
│       │
│       ├── 07-attacking-and-battles/
│       │   ├── light.md
│       │   ├── full.md
│       │   ├── attack-step.md (detailed subsection)
│       │   ├── block-step.md (detailed subsection)
│       │   ├── action-step.md (detailed subsection)
│       │   ├── damage-step.md (detailed subsection)
│       │   └── battle-end-step.md (detailed subsection)
│       │
│       ├── 08-action-steps/
│       │   ├── light.md
│       │   └── full.md
│       │
│       ├── 09-effect-activation-and-resolution/
│       │   ├── light.md
│       │   └── full.md
│       │
│       ├── 10-rules-management/
│       │   ├── light.md
│       │   └── full.md
│       │
│       └── 11-keyword-effects-and-keywords/
│           ├── light.md
│           ├── full.md
│           ├── keyword-effects.md (all angle-bracket effects)
│           └── keywords.md (all square-bracket keywords)
```

**File Naming Conventions:**
- Folder names: `##-section-name` (numbered for ordering)
- Light summaries: `light.md` (consistent across all sections)
- Full content: `full.md` (complete details from original RULES.md)
- Subsections: `descriptive-name.md` (for complex sections requiring breakdown)
- Indexes: `UPPERCASE-INDEX.md` (for top-level navigation documents)

### Content Strategy for Each Tier

**Tier 1 (INDEX.md):**
- Brief 1-2 sentence overview of each main section
- Direct link to corresponding `light.md` file
- Quick reference table of contents
- Link to KEYWORDS-INDEX.md for fast lookup

**Tier 2 (light.md files):**
- Structured bullet-point summaries of key concepts
- Essential rules without exhaustive sub-rules
- Links to `full.md` for complete details
- Links to related subsection files (if applicable)
- ~100-200 lines per file (estimated)

**Tier 3 (full.md files):**
- Complete rule text from original RULES.md
- All numbered subsections preserved
- Cross-references converted to markdown links
- Examples and edge cases included
- ~300-500 lines per file (estimated, varies by section)

**KEYWORDS-INDEX.md:**
- Alphabetical listing of all keywords and keyword effects
- Brief one-line description
- Direct link to detailed explanation in relevant section
- Searchable format for LLM quick reference

### Cross-Reference Conversion Examples

**Original format:**
```
(See 7-6. Damage Step)
```

**Converted format:**
```
(See [7-6. Damage Step](./07-attacking-and-battles/damage-step.md))
```

**Original format:**
```
(See 11-1-5. <First Strike>)
```

**Converted format:**
```
(See [11-1-5. <First Strike>](./11-keyword-effects-and-keywords/keyword-effects.md#first-strike))
```

### Non-Functional Requirements

**LLM Optimization:**
- Files structured for progressive detail loading
- Clear navigation hierarchy for token-efficient context building
- Logical groupings that allow LLMs to load only relevant sections
- Keyword index for rapid reference without full context loading

**Maintainability:**
- Clear file organization for future rule updates
- Consistent naming and structure across all sections
- Original RULES.md preserved as authoritative source
- Documentation-only changes (no engine code modifications)

**Accuracy:**
- Zero rule content modifications
- All rule numbers and subsection identifiers preserved
- Examples and clarifications maintained verbatim
- Version number and date preserved from original

### Scope Boundaries

**In Scope:**
- Restructuring RULES.md into three-tier progressive disclosure system
- Creating INDEX.md as main entry point
- Generating light.md summaries for all 11 main sections
- Creating full.md files with complete rule details
- Subdividing complex sections (especially Section 7) into logical subsections
- Building KEYWORDS-INDEX.md for quick reference
- Converting all internal cross-references to markdown links
- Organizing files into clear folder structure
- Preserving all original rule content and formatting

**Out of Scope:**
- Code changes to the Gundam engine implementation
- Rule interpretations or clarifications beyond what exists in RULES.md
- Visual design or formatting beyond markdown structure
- Integration with the game engine codebase
- Automated testing of rules documentation
- Multiplayer rules documentation (mentioned but marked as separate rules)
- Tournament or competitive play guidelines
- Modification of original RULES.md file (keep as reference)

### Technical Considerations

**Target Location:**
- Primary documentation: `packages/gundam-engine/docs/rules/`
- Preserve original: `packages/gundam-engine/RULES.md`

**Documentation Format:**
- Pure markdown (.md files)
- No special tooling or generators required
- Human-readable and LLM-parseable
- GitHub-flavored markdown for compatibility

**Version Tracking:**
- Maintain original version number: Ver. 1.0
- Maintain original update date: November 29, 2024
- Include metadata in INDEX.md about restructuring date

**Existing Patterns to Follow:**
Based on the tech stack and standards files loaded, this project uses:
- Markdown for documentation
- Clear file organization and naming conventions
- Comprehensive commenting and documentation practices
- No specific standards files were found that directly apply to pure documentation restructuring

### Success Criteria

1. LLM agents can navigate rules efficiently through three-tier progressive disclosure
2. INDEX.md serves as clear entry point with navigation to all sections
3. Light versions provide digestible summaries suitable for quick reference
4. Full versions contain complete, unmodified rule content from original
5. Complex sections (especially Section 7) are appropriately subdivided
6. KEYWORDS-INDEX.md enables rapid lookup of specific effects and keywords
7. All cross-references converted to functional markdown links
8. No rule content lost, modified, or misinterpreted
9. File organization is logical and maintainable
10. Documentation is ready for immediate use by LLM agents

### Recommendations for Optimal LLM Consumption

**Progressive Context Loading:**
1. Always start LLM prompts at INDEX.md
2. Load light.md files for initial rule understanding
3. Only load full.md when detailed rule interpretation needed
4. Use KEYWORDS-INDEX.md for specific mechanic lookups

**Section Breakdown Strategy:**

**Simple sections (keep as 2 files: light + full):**
- Section 1: Game Overview
- Section 3: Game Locations
- Section 4: Essential Terminology
- Section 5: Preparing to Play
- Section 8: Action Steps
- Section 10: Rules Management

**Moderate complexity (light + full + possible subsections):**
- Section 2: Card Information (consider splitting by card type: Unit, Pilot, Command, Base, Resource)
- Section 6: Game Progression (consider splitting by phase)

**High complexity (light + full + multiple subsections):**
- Section 7: Attacking and Battles (definitely split into 5 step files: attack-step, block-step, action-step, damage-step, battle-end-step)
- Section 9: Effect Activation and Resolution (consider splitting by effect type)
- Section 11: Keyword Effects and Keywords (split into keyword-effects.md and keywords.md minimum)

**Estimated File Counts:**
- Total folders: 11 (one per main section)
- Minimum files: ~35-40 (INDEX + KEYWORDS-INDEX + light/full for each section + subsections)
- Each light.md: 100-200 lines (estimated)
- Each full.md: 50-500 lines (varies by section complexity)
- Total documentation size: Similar to original 1,145 lines, but distributed for optimal access

### Implementation Priority

**Phase 1 (Foundation):**
1. Create folder structure
2. Generate INDEX.md with navigation
3. Create KEYWORDS-INDEX.md

**Phase 2 (Core Sections):**
4. Split Section 7 (Attacking and Battles) - most complex
5. Split Section 11 (Keyword Effects and Keywords)
6. Create light + full for Sections 1, 3, 4, 5, 8, 10

**Phase 3 (Remaining Sections):**
7. Create light + full for Sections 2, 6, 9
8. Evaluate if further subsection breakdown needed

**Phase 4 (Polish):**
9. Convert all cross-references to markdown links
10. Verify navigation flow
11. Test with sample LLM prompts for usability

## Metadata

- **Spec Name:** gundam-engine
- **Spec Path:** agent-os/specs/2025-10-11-gundam-engine
- **Date Created:** 2025-10-11
- **Target Package:** packages/gundam-engine
- **Specification Type:** Documentation restructuring only
- **Original Source:** packages/gundam-engine/RULES.md (Ver. 1.0, November 29, 2024)
- **Total Original Lines:** 1,145
- **Main Sections:** 11
- **Keywords to Index:** 12 keywords + 6 keyword effects = 18 total
