# Technical Specification

This is the technical specification for the spec detailed in @agent-os/specs/2025-10-11-gundam-engine/spec.md

## Technical Requirements

### Documentation Structure

**Folder Organization:**
- Create `packages/gundam-engine/docs/rules/` as the root documentation directory
- Preserve original `packages/gundam-engine/RULES.md` file unchanged
- Implement 11 numbered folders (01-game-overview through 11-keyword-effects-and-keywords)
- Use consistent naming: `##-section-name` format for folders
- Each folder contains at minimum: `light.md` and `full.md`

**Three-Tier File System:**
1. **Tier 1 - Entry Point:**
   - `INDEX.md` at `docs/rules/INDEX.md`
   - Contains: Version info (Ver. 1.0, Nov 29, 2024), restructure date, table of contents
   - Format: 1-2 sentence overview per section + markdown link to corresponding light.md
   - Include prominent link to KEYWORDS-INDEX.md at top

2. **Tier 2 - Light Summaries:**
   - `light.md` in each section folder
   - Target length: 100-200 lines per file
   - Format: Structured bullet points, key concepts only, essential rules without exhaustive sub-rules
   - End with "For complete details, see [full rules](./full.md)"
   - Include links to any subsection files

3. **Tier 3 - Full Details:**
   - `full.md` in each section folder
   - Contains: Complete rule text from original RULES.md section
   - Preserve all numbered subsections (e.g., 7-6-2-3-1)
   - Maintain formal comprehensive rulebook language
   - Convert all cross-references to markdown links
   - Include all examples and edge cases verbatim

**Section-Specific Breakdown:**

*Simple Sections (light.md + full.md only):*
- 01-game-overview
- 03-game-locations
- 04-essential-terminology
- 05-preparing-to-play
- 08-action-steps
- 10-rules-management

*Moderate Complexity (light.md + full.md + potential subsections):*
- 02-card-information: Consider adding card-type-specific files if full.md exceeds 400 lines
- 06-game-progression: Consider phase-specific files (start-phase.md, draw-phase.md, etc.) if needed

*High Complexity (light.md + full.md + mandatory subsections):*
- 07-attacking-and-battles:
  - `attack-step.md` (rules 7-3-*)
  - `block-step.md` (rules 7-4-*)
  - `action-step.md` (rules 7-5-*)
  - `damage-step.md` (rules 7-6-*)
  - `battle-end-step.md` (rules 7-7-*)

- 09-effect-activation-and-resolution: Consider splitting by effect type (constant, triggered, activated, command, substitution) if full.md exceeds 400 lines

- 11-keyword-effects-and-keywords:
  - `keyword-effects.md` (all angle-bracket effects: <Repair>, <Breach>, <Support>, <Blocker>, <First Strike>, <High-Maneuver>)
  - `keywords.md` (all square-bracket keywords: 【Activate・Main】, 【Activate・Action】, 【Main】, 【Action】, 【Burst】, 【Deploy】, 【Attack】, 【Destroyed】, 【When Paired】, 【During Pair】, 【Pilot】, 【Once per Turn】)

### Keyword Index Implementation

**KEYWORDS-INDEX.md Requirements:**
- Location: `docs/rules/KEYWORDS-INDEX.md` (sibling to INDEX.md)
- Format: Alphabetical listing with two main sections: "Keyword Effects" and "Keywords"
- Each entry format:
  ```markdown
  - **<Keyword/Effect Name>** - One-line description → [Full details](./##-section-name/file.md#anchor)
  ```

**Keyword Effects to Index (6 total):**
1. <Blocker> - Change attack target to blocking Unit
2. <Breach> - Deal damage to shield area when destroying enemy Unit
3. <First Strike> - Deal damage before enemy in battle
4. <High-Maneuver> - Prevent enemy <Blocker> activation
5. <Repair> - Recover HP at end of turn
6. <Support> - Grant AP to another friendly Unit

**Keywords to Index (12 total):**
1. 【Activate・Action】 - Activated effect during action steps
2. 【Activate・Main】 - Activated effect during main phase
3. 【Action】 - Command card playable during action step
4. 【Attack】 - Triggered effect when Unit attacks
5. 【Burst】 - Triggered effect when Shield destroyed
6. 【Deploy】 - Triggered effect when Unit/Base deployed
7. 【Destroyed】 - Triggered effect when Unit/Base destroyed
8. 【During Pair】 - Constant effect while Pilot paired
9. 【Main】 - Command card playable during main phase
10. 【Once per Turn】 - Effect activation limit
11. 【Pilot】 - Pilot qualification keyword
12. 【When Paired】 - Triggered effect when Pilot paired

### Cross-Reference Conversion

**Conversion Rules:**
- Pattern: `(See X-Y. Section Name)` → `(See [X-Y. Section Name](./relative/path/file.md))`
- Pattern: `(See X-Y-Z. Subsection)` → `(See [X-Y-Z. Subsection](./relative/path/file.md#subsection-anchor))`
- All links must use relative paths from current file location
- Section anchors use GitHub-flavored markdown: lowercase, hyphens for spaces, no special characters

**Example Conversions:**

Original in Section 6:
```
(See 7. Attacking and Battles)
```
Converted:
```
(See [7. Attacking and Battles](../07-attacking-and-battles/full.md))
```

Original in Section 7:
```
(See 11-1-5. <First Strike>)
```
Converted:
```
(See [11-1-5. <First Strike>](../11-keyword-effects-and-keywords/keyword-effects.md#first-strike))
```

**Cross-Reference Audit:**
- Search original RULES.md for all instances of `(See X-Y` pattern
- Create mapping document of all cross-references during implementation
- Verify all links functional after file creation

### Markdown Standards

**File Format:**
- GitHub-flavored markdown (.md extension)
- UTF-8 encoding
- Unix line endings (LF)
- No trailing whitespace

**Heading Hierarchy:**
- H1 (`#`) - File title only
- H2 (`##`) - Major section dividers
- H3 (`###`) - Subsections
- H4 (`####`) - Sub-subsections (sparingly)
- Preserve original numbering in headings: `## 7-6. Damage Step`

**Lists and Formatting:**
- Maintain original list numbering from RULES.md
- Use bullet points for summaries in light.md files
- Preserve code-like formatting for special syntax: `<Blocker>`, `【Deploy】`
- Keep example blocks in code fences if present

### Version Control

**Metadata Tracking:**
- INDEX.md must include:
  - Original version: "Based on Gundam Card Game Comprehensive Rules Ver. 1.0"
  - Original date: "Updated November 29, 2024"
  - Restructure date: "Restructured YYYY-MM-DD"
- Each full.md should reference original section number
- Preserve all rule numbers exactly as in original

**File Preservation:**
- Original RULES.md remains at `packages/gundam-engine/RULES.md`
- No modifications to original file
- New documentation lives entirely in `docs/rules/` subdirectory

### Implementation Order

**Phase 1 - Foundation (Priority 1):**
1. Create folder structure: `docs/rules/01-game-overview/` through `docs/rules/11-keyword-effects-and-keywords/`
2. Create INDEX.md with version info and section overview
3. Create KEYWORDS-INDEX.md with all 18 entries

**Phase 2 - Complex Sections (Priority 2):**
4. Split Section 7 (Attacking and Battles) into 5 step files + light.md + full.md
5. Split Section 11 (Keyword Effects and Keywords) into keyword-effects.md + keywords.md + light.md + full.md

**Phase 3 - Simple Sections (Priority 3):**
6. Create light.md + full.md for sections: 1, 3, 4, 5, 8, 10

**Phase 4 - Moderate Sections (Priority 4):**
7. Create light.md + full.md for sections: 2, 6, 9
8. Evaluate if subsection breakdown needed based on file size

**Phase 5 - Cross-References (Priority 5):**
9. Convert all internal references to markdown links
10. Verify all links functional
11. Update KEYWORDS-INDEX.md links to point to correct files

**Phase 6 - Verification (Priority 6):**
12. Verify no rule content lost or modified
13. Verify all 1,145 lines accounted for across new files
14. Test navigation flow from INDEX.md through various paths

### Success Metrics

**Completeness:**
- All 11 sections split into appropriate files
- All 18 keywords/effects indexed in KEYWORDS-INDEX.md
- All cross-references converted (estimate: 50-100 references total)
- Original RULES.md preserved unchanged

**Navigation Efficiency:**
- INDEX.md serves as single entry point
- Maximum 2 clicks to reach any rule detail (INDEX → light → full or subsection)
- All KEYWORDS-INDEX.md links functional

**Content Accuracy:**
- Zero rule modifications or interpretations
- All rule numbers preserved exactly
- All examples and edge cases included
- Version and date metadata accurate

### LLM Optimization Guidelines

**Token Efficiency:**
- Light.md files should be loadable in single context window (~2,000 tokens)
- Full.md files kept under 10,000 tokens where possible
- Complex sections subdivided to keep individual files focused

**Navigation Patterns:**
- Always start at INDEX.md for orientation
- Load light.md for quick reference
- Load full.md only when detailed interpretation required
- Use KEYWORDS-INDEX.md for specific mechanic lookup

**Context Building Strategy:**
- Incremental loading: INDEX → light → full
- Targeted loading: KEYWORDS-INDEX → specific file
- Related loading: Follow cross-reference links as needed

## External Dependencies

**None Required**

This is a pure documentation restructuring effort requiring no external libraries, tools, or dependencies. All work involves creating and organizing markdown files within the existing repository structure.
