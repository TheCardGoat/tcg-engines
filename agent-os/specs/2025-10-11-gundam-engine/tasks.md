# Spec Tasks

These are the tasks to be completed for the spec detailed in @agent-os/specs/2025-10-11-gundam-engine/spec.md

> Created: 2025-10-11
> Status: In Progress

## Progress Tracker

- [x] **Phase 1: Foundation Setup** - COMPLETED
- [x] **Phase 2: High-Complexity Sections with Subsections** - COMPLETED
- [ ] Phase 3: Simple Sections (light.md + full.md)
- [ ] Phase 4: Moderate-Complexity Sections (Evaluate for Subsections)
- [ ] Phase 5: Cross-Reference Conversion and Linking
- [ ] Phase 6: Verification and Quality Assurance

## Tasks

### Phase 1: Foundation Setup ✓ COMPLETED

**Task 1.1: Create Base Folder Structure**
- Create `packages/gundam-engine/docs/rules/` directory as root
- Create 11 numbered section folders following `##-section-name` format:
  - `01-game-overview/`
  - `02-card-information/`
  - `03-game-locations/`
  - `04-essential-terminology/`
  - `05-preparing-to-play/`
  - `06-game-progression/`
  - `07-attacking-and-battles/`
  - `08-action-steps/`
  - `09-effect-activation-and-resolution/`
  - `10-rules-management/`
  - `11-keyword-effects-and-keywords/`
- Verify original `packages/gundam-engine/RULES.md` remains unchanged
- Document folder structure created successfully

**Task 1.2: Create INDEX.md Entry Point**
- Create `docs/rules/INDEX.md` as main entry point
- Include metadata:
  - Original version: "Based on Gundam Card Game Comprehensive Rules Ver. 1.0"
  - Original date: "Updated November 29, 2024"
  - Restructure date: "Restructured 2025-10-11"
- Add prominent link to KEYWORDS-INDEX.md at top
- Create table of contents with 11 sections
- Write 1-2 sentence overview for each section with markdown link to corresponding light.md
- Verify all links use correct relative paths
- Review INDEX.md for completeness and navigation clarity

**Task 1.3: Create KEYWORDS-INDEX.md Quick-Lookup**
- Create `docs/rules/KEYWORDS-INDEX.md` at root level
- Structure with two main sections: "Keyword Effects" and "Keywords"
- Add all 6 Keyword Effects with one-line descriptions:
  - `<Blocker>` - Change attack target to blocking Unit
  - `<Breach>` - Deal damage to shield area when destroying enemy Unit
  - `<First Strike>` - Deal damage before enemy in battle
  - `<High-Maneuver>` - Prevent enemy <Blocker> activation
  - `<Repair>` - Recover HP at end of turn
  - `<Support>` - Grant AP to another friendly Unit
- Add all 12 Keywords with one-line descriptions:
  - `【Activate・Action】` - Activated effect during action steps
  - `【Activate・Main】` - Activated effect during main phase
  - `【Action】` - Command card playable during action step
  - `【Attack】` - Triggered effect when Unit attacks
  - `【Burst】` - Triggered effect when Shield destroyed
  - `【Deploy】` - Triggered effect when Unit/Base deployed
  - `【Destroyed】` - Triggered effect when Unit/Base destroyed
  - `【During Pair】` - Constant effect while Pilot paired
  - `【Main】` - Command card playable during main phase
  - `【Once per Turn】` - Effect activation limit
  - `【Pilot】` - Pilot qualification keyword
  - `【When Paired】` - Triggered effect when Pilot paired
- Add placeholder links (to be updated in Phase 5) following format: `[Full details](./##-section-name/file.md#anchor)`
- Verify alphabetical ordering within each section
- Review KEYWORDS-INDEX.md for accuracy and completeness

---

### Phase 2: High-Complexity Sections with Subsections ✓ COMPLETED

**Task 2.1: Create Section 7 (Attacking and Battles) Documentation**
- Read Section 7 from original RULES.md (lines covering attacking and battles)
- Create `07-attacking-and-battles/light.md`:
  - Write 100-200 line summary with key concepts using structured bullet points
  - Include overview of battle flow and major steps
  - Add links to all subsection files (attack-step.md, block-step.md, etc.)
  - End with "For complete details, see [full rules](./full.md)"
- Create `07-attacking-and-battles/full.md`:
  - Copy complete Section 7 text from original RULES.md
  - Preserve all numbered subsections (7-1, 7-2, etc.)
  - Maintain formal comprehensive rulebook language
  - Keep all examples and edge cases verbatim
  - Add placeholder cross-references (to be converted in Phase 5)
- Create subsection files with extracted content from full.md:
  - `attack-step.md` (rules 7-3-*)
  - `block-step.md` (rules 7-4-*)
  - `action-step.md` (rules 7-5-*)
  - `damage-step.md` (rules 7-6-*)
  - `battle-end-step.md` (rules 7-7-*)
- Verify each subsection file contains complete relevant rule text
- Verify all Section 7 content accounted for across files
- Review light.md for clarity and appropriate summarization
- Review full.md and subsection files for accuracy and completeness

**Task 2.2: Create Section 11 (Keyword Effects and Keywords) Documentation**
- Read Section 11 from original RULES.md (lines covering keyword effects and keywords)
- Create `11-keyword-effects-and-keywords/light.md`:
  - Write 100-200 line summary with key concepts
  - Include brief explanation of keyword effects vs keywords distinction
  - Add links to keyword-effects.md and keywords.md
  - End with "For complete details, see [full rules](./full.md)"
- Create `11-keyword-effects-and-keywords/full.md`:
  - Copy complete Section 11 text from original RULES.md
  - Preserve all numbered subsections (11-1-*, 11-2-*)
  - Maintain formal comprehensive rulebook language
  - Keep all examples and edge cases verbatim
  - Add placeholder cross-references (to be converted in Phase 5)
- Create `11-keyword-effects-and-keywords/keyword-effects.md`:
  - Extract all 6 angle-bracket keyword effects: `<Repair>`, `<Breach>`, `<Support>`, `<Blocker>`, `<First Strike>`, `<High-Maneuver>`
  - Include complete rule text for each keyword effect
  - Add proper heading anchors for cross-reference linking
- Create `11-keyword-effects-and-keywords/keywords.md`:
  - Extract all 12 square-bracket keywords: `【Activate・Main】`, `【Activate・Action】`, `【Main】`, `【Action】`, `【Burst】`, `【Deploy】`, `【Attack】`, `【Destroyed】`, `【When Paired】`, `【During Pair】`, `【Pilot】`, `【Once per Turn】`
  - Include complete rule text for each keyword
  - Add proper heading anchors for cross-reference linking
- Verify all 18 keywords/effects properly extracted
- Verify all Section 11 content accounted for across files
- Review light.md for clarity and appropriate summarization
- Review full.md, keyword-effects.md, and keywords.md for accuracy and completeness

---

### Phase 3: Simple Sections (light.md + full.md)

**Task 3.1: Create Section 1 (Game Overview) Documentation**
- Read Section 1 from original RULES.md
- Create `01-game-overview/light.md`:
  - Write 100-200 line summary with key concepts using structured bullet points
  - Focus on game objective, basic flow, and winning conditions
  - End with "For complete details, see [full rules](./full.md)"
- Create `01-game-overview/full.md`:
  - Copy complete Section 1 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Verify all Section 1 content accounted for
- Review light.md for clarity and full.md for accuracy

**Task 3.2: Create Section 3 (Game Locations) Documentation**
- Read Section 3 from original RULES.md
- Create `03-game-locations/light.md`:
  - Write 100-200 line summary covering all game zones/areas
  - Use structured bullet points for each location type
  - End with "For complete details, see [full rules](./full.md)"
- Create `03-game-locations/full.md`:
  - Copy complete Section 3 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Verify all Section 3 content accounted for
- Review light.md for clarity and full.md for accuracy

**Task 3.3: Create Section 4 (Essential Terminology) Documentation**
- Read Section 4 from original RULES.md
- Create `04-essential-terminology/light.md`:
  - Write 100-200 line summary with key terms and definitions
  - Organize alphabetically or by category
  - End with "For complete details, see [full rules](./full.md)"
- Create `04-essential-terminology/full.md`:
  - Copy complete Section 4 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Verify all Section 4 content accounted for
- Review light.md for clarity and full.md for accuracy

**Task 3.4: Create Section 5 (Preparing to Play) Documentation**
- Read Section 5 from original RULES.md
- Create `05-preparing-to-play/light.md`:
  - Write 100-200 line summary covering setup steps
  - Use structured bullet points for setup sequence
  - End with "For complete details, see [full rules](./full.md)"
- Create `05-preparing-to-play/full.md`:
  - Copy complete Section 5 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Verify all Section 5 content accounted for
- Review light.md for clarity and full.md for accuracy

**Task 3.5: Create Section 8 (Action Steps) Documentation**
- Read Section 8 from original RULES.md
- Create `08-action-steps/light.md`:
  - Write 100-200 line summary explaining action step mechanics
  - Focus on when and how action steps occur
  - End with "For complete details, see [full rules](./full.md)"
- Create `08-action-steps/full.md`:
  - Copy complete Section 8 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Verify all Section 8 content accounted for
- Review light.md for clarity and full.md for accuracy

**Task 3.6: Create Section 10 (Rules Management) Documentation**
- Read Section 10 from original RULES.md
- Create `10-rules-management/light.md`:
  - Write 100-200 line summary covering timing rules, priority, and conflict resolution
  - Use structured bullet points for key concepts
  - End with "For complete details, see [full rules](./full.md)"
- Create `10-rules-management/full.md`:
  - Copy complete Section 10 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Verify all Section 10 content accounted for
- Review light.md for clarity and full.md for accuracy

---

### Phase 4: Moderate-Complexity Sections (Evaluate for Subsections)

**Task 4.1: Create Section 2 (Card Information) Documentation**
- Read Section 2 from original RULES.md
- Create `02-card-information/light.md`:
  - Write 100-200 line summary covering card types and card anatomy
  - Use structured bullet points for each card type
  - End with "For complete details, see [full rules](./full.md)"
- Create `02-card-information/full.md`:
  - Copy complete Section 2 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Evaluate full.md file size:
  - If exceeds 400 lines, consider creating card-type-specific subsection files
  - If subsections needed, extract content and update light.md links
- Verify all Section 2 content accounted for
- Review light.md for clarity and full.md for accuracy

**Task 4.2: Create Section 6 (Game Progression) Documentation**
- Read Section 6 from original RULES.md
- Create `06-game-progression/light.md`:
  - Write 100-200 line summary covering turn structure and phases
  - Use structured bullet points for phase sequence
  - End with "For complete details, see [full rules](./full.md)"
- Create `06-game-progression/full.md`:
  - Copy complete Section 6 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Evaluate full.md file size:
  - If exceeds 400 lines, consider creating phase-specific subsection files (start-phase.md, draw-phase.md, etc.)
  - If subsections needed, extract content and update light.md links
- Verify all Section 6 content accounted for
- Review light.md for clarity and full.md for accuracy

**Task 4.3: Create Section 9 (Effect Activation and Resolution) Documentation**
- Read Section 9 from original RULES.md
- Create `09-effect-activation-and-resolution/light.md`:
  - Write 100-200 line summary covering effect types and resolution rules
  - Use structured bullet points for different effect categories
  - End with "For complete details, see [full rules](./full.md)"
- Create `09-effect-activation-and-resolution/full.md`:
  - Copy complete Section 9 text from original RULES.md
  - Preserve all numbered subsections
  - Maintain formal comprehensive rulebook language
  - Add placeholder cross-references (to be converted in Phase 5)
- Evaluate full.md file size:
  - If exceeds 400 lines, consider splitting by effect type (constant, triggered, activated, command, substitution)
  - If subsections needed, extract content and update light.md links
- Verify all Section 9 content accounted for
- Review light.md for clarity and full.md for accuracy

---

### Phase 5: Cross-Reference Conversion and Linking

**Task 5.1: Audit All Cross-References in Original RULES.md**
- Search original RULES.md for all instances matching pattern `(See X-Y` or `(See X-Y-Z`
- Create mapping document listing:
  - Each cross-reference found
  - Source section/subsection where reference appears
  - Target section/subsection being referenced
  - Expected file location and anchor for target
- Count total cross-references found (estimated 50-100)
- Document audit results for reference during conversion

**Task 5.2: Convert Cross-References in Simple Sections**
- Process sections: 1, 3, 4, 5, 8, 10
- For each full.md file:
  - Identify all `(See X-Y. Section Name)` patterns
  - Convert to `(See [X-Y. Section Name](relative-path-to-target-file.md))`
  - Identify all `(See X-Y-Z. Subsection)` patterns
  - Convert to `(See [X-Y-Z. Subsection](relative-path-to-target-file.md#anchor))`
  - Use correct relative paths from current file location
  - Use lowercase GitHub-flavored markdown anchors (spaces to hyphens, no special chars)
- Verify converted links use proper relative paths
- Document sections completed

**Task 5.3: Convert Cross-References in Moderate-Complexity Sections**
- Process sections: 2, 6, 9
- For each full.md file:
  - Identify all `(See X-Y. Section Name)` patterns
  - Convert to markdown links with relative paths
  - Identify all `(See X-Y-Z. Subsection)` patterns
  - Convert to markdown links with anchors
- If subsection files created, convert references in those files as well
- Verify converted links use proper relative paths
- Document sections completed

**Task 5.4: Convert Cross-References in High-Complexity Sections**
- Process Section 7 (Attacking and Battles):
  - Convert references in full.md
  - Convert references in all 5 subsection files (attack-step.md, block-step.md, action-step.md, damage-step.md, battle-end-step.md)
  - Pay special attention to internal section references (e.g., 7-6 referencing 7-3)
- Process Section 11 (Keyword Effects and Keywords):
  - Convert references in full.md
  - Convert references in keyword-effects.md
  - Convert references in keywords.md
  - Ensure keyword-specific references point to correct files and anchors
- Verify all converted links use proper relative paths
- Document sections completed

**Task 5.5: Update KEYWORDS-INDEX.md with Final Links**
- For each of 6 Keyword Effects entries:
  - Replace placeholder links with actual file paths and anchors
  - Verify links point to correct locations in keyword-effects.md
  - Test link format: `[Full details](./11-keyword-effects-and-keywords/keyword-effects.md#anchor)`
- For each of 12 Keywords entries:
  - Replace placeholder links with actual file paths and anchors
  - Verify links point to correct locations in keywords.md
  - Test link format: `[Full details](./11-keyword-effects-and-keywords/keywords.md#anchor)`
- Verify all 18 links are functional
- Review KEYWORDS-INDEX.md for link accuracy

**Task 5.6: Update INDEX.md with Final Section Links**
- For each of 11 section overview entries:
  - Verify links point to correct light.md files
  - Test link format: `[Section Name](./##-section-name/light.md)`
  - Ensure relative paths are correct from INDEX.md location
- Verify KEYWORDS-INDEX.md link at top of file is correct
- Review INDEX.md for navigation completeness

---

### Phase 6: Verification and Quality Assurance

**Task 6.1: Verify Content Completeness**
- Compare original RULES.md line count (1,145 lines) with sum of all full.md and subsection files
- For each of 11 sections:
  - Verify original section content fully represented in new documentation
  - Check that no rule text was accidentally omitted or truncated
  - Verify all examples and edge cases included
  - Confirm all numbered subsections preserved
- Create verification report documenting:
  - Original RULES.md sections mapped to new file structure
  - Line count comparison (original vs new documentation)
  - Any discrepancies found and resolved
- Document verification completed successfully

**Task 6.2: Verify Link Functionality**
- Test all links in INDEX.md by checking target files exist at specified paths
- Test all links in KEYWORDS-INDEX.md by verifying:
  - Target files exist
  - Section anchors match actual heading names
- Test cross-reference links in all full.md files:
  - Verify relative paths resolve correctly
  - Verify section anchors exist in target files
  - Check for broken links or incorrect paths
- Test cross-reference links in all subsection files (Sections 7, 11)
- Create link verification report documenting:
  - Total links tested
  - Broken links found (if any)
  - Fixes applied
- Document all links verified as functional

**Task 6.3: Verify Metadata and Version Information**
- Check INDEX.md contains:
  - Original version: "Based on Gundam Card Game Comprehensive Rules Ver. 1.0"
  - Original date: "Updated November 29, 2024"
  - Restructure date: "Restructured 2025-10-11"
- Verify each full.md references original section number in heading
- Verify original RULES.md remains unchanged at `packages/gundam-engine/RULES.md`
- Check all rule numbers preserved exactly as in original
- Document metadata verification completed

**Task 6.4: Test Navigation Flow Scenarios**
- Test "New Developer Learning Path":
  - Start at INDEX.md
  - Navigate to Section 1 light.md
  - Progress to Section 1 full.md
  - Verify 2-click maximum to reach any rule detail
- Test "Keyword Lookup Path":
  - Start at KEYWORDS-INDEX.md
  - Click on `<Blocker>` entry
  - Verify direct navigation to keyword-effects.md with correct anchor
  - Test 3 additional keyword entries
- Test "Cross-Reference Navigation Path":
  - Start at Section 6 full.md
  - Follow cross-reference link to Section 7
  - Verify correct target file and anchor reached
  - Test 3 additional cross-reference links from different sections
- Test "Complex Section Navigation Path":
  - Start at Section 7 light.md
  - Navigate to damage-step.md subsection
  - Follow cross-reference to related rule in different file
  - Verify seamless navigation between subsections
- Document all navigation paths tested successfully

**Task 6.5: Verify File Organization and Naming Conventions**
- Verify folder structure matches specification:
  - Root directory: `packages/gundam-engine/docs/rules/`
  - 11 numbered folders use `##-section-name` format
  - All folders contain minimum required files (light.md, full.md)
- Verify subsection organization:
  - Section 7 contains 5 step files in correct folder
  - Section 11 contains keyword-effects.md and keywords.md in correct folder
- Check markdown standards compliance:
  - All files use .md extension
  - UTF-8 encoding
  - Unix line endings (LF)
  - No trailing whitespace
- Verify heading hierarchy:
  - H1 used for file title only
  - H2-H4 used appropriately
  - Original numbering preserved in headings
- Document file organization verified as compliant

**Task 6.6: Final Documentation Review and Completion Report**
- Review all light.md files:
  - Verify 100-200 line target length maintained
  - Check structured bullet points used appropriately
  - Confirm "For complete details" links present and correct
- Review all full.md files:
  - Verify formal comprehensive rulebook language preserved
  - Check all numbered subsections intact
  - Confirm examples and edge cases included
- Create final completion report documenting:
  - All 11 sections successfully restructured
  - Total files created (estimate: 35-40 files)
  - All 18 keywords/effects indexed and linked
  - All cross-references converted (total count)
  - Navigation efficiency confirmed (2-click maximum)
  - Content accuracy verified (zero modifications)
  - Original RULES.md preserved unchanged
- Document spec implementation completed and ready for use

---

## Implementation Notes

**Documentation-Only Spec:**
- This spec involves only documentation creation (no code changes)
- No test files needed (no code to test)
- No linter checks needed (markdown documentation)
- No typecheck needed (no TypeScript code)
- No code-reviewer needed (no code implementation)

**Focus Areas:**
- Accurate content extraction and organization
- Proper markdown formatting and structure
- Functional cross-reference linking
- Clear navigation pathways
- Complete preservation of original rule content

**Success Criteria:**
- All 1,145 lines of RULES.md accounted for in new structure
- Zero rule modifications or content loss
- All cross-references converted to functional markdown links
- Maximum 2-click navigation to any rule detail
- LLM-optimized progressive disclosure achieved
