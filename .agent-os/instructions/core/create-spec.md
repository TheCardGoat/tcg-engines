---
description: Spec Creation Rules for Agent OS
globs:
alwaysApply: false
version: 1.1
encoding: UTF-8
---

# Spec Creation Rules

## Overview

Generate detailed feature specifications aligned with product roadmap and mission.

<pre_flight_check>
  EXECUTE: @.agent-os/instructions/meta/pre-flight.md
</pre_flight_check>

<project_context_requirement>
  CRITICAL: This @core/ instruction requires valid project context.
  
  REQUIRED INPUT: {PROJECT_NAME} must be set and validated
  PURPOSE: Ensures spec creation is scoped to correct project
  
  IF PROJECT_NAME not available:
    STOP: Cannot proceed without project context
    REFER: User to project setup documentation
</project_context_requirement>

<process_flow>

<step number="0" subagent="context-fetcher" name="identify_project_context">

### Step 0: Identify Project Context

Use the context-fetcher subagent to identify and validate project context by determining the current working directory path or prompting the user for the specific project.

<context_detection_process>
  <primary_detection>
    ACTION: Analyze current working directory
    CHECK: If current path contains "apps/" OR "packages/"
    
    IF path contains "apps/[project-name]":
      SET PROJECT_TYPE = "apps"
      SET PROJECT_NAME = [project-name]
      SET PROJECT_ROOT = "apps/[project-name]"
      SET AGENT_OS_PATH = ".agent-os/apps/[project-name]"
      PROCEED to validation
    
    ELSE IF path contains "packages/[project-name]":
      SET PROJECT_TYPE = "packages"
      SET PROJECT_NAME = [project-name]
      SET PROJECT_ROOT = "packages/[project-name]"
      SET AGENT_OS_PATH = ".agent-os/packages/[project-name]"
      PROCEED to validation
      
    ELSE:
      PROCEED to user prompt
  </primary_detection>
  
  <user_prompt_fallback>
    IF project context not detected from directory:
      PROMPT: "Which project are you working on? Please specify:
               - For apps: 'apps/simulator', 'apps/server', 'apps/lorcanary'
               - For packages: 'packages/lorcana-engine', 'packages/persistence', etc.
               
               Format: [apps|packages]/[project-name]"
      
      WAIT: For user response
      PARSE: User response to extract PROJECT_TYPE and PROJECT_NAME
      
      EXAMPLE parsing:
        Input: "apps/simulator" → PROJECT_TYPE="apps", PROJECT_NAME="simulator"
        Input: "packages/lorcana-engine" → PROJECT_TYPE="packages", PROJECT_NAME="lorcana-engine"
      
      SET variables based on parsed input
  </user_prompt_fallback>
  
  <context_validation>
    VALIDATE all required variables are set:
    1. PROJECT_TYPE must be "apps" OR "packages"
    2. PROJECT_NAME must be non-empty string
    3. PROJECT_ROOT must be valid path format
    4. AGENT_OS_PATH must follow pattern ".agent-os/{PROJECT_TYPE}/{PROJECT_NAME}"
    
    IF validation fails:
      ERROR: "Invalid project context. Please provide project in format: [apps|packages]/[project-name]"
      STOP: Cannot proceed without valid project context
      REFER: User to project setup documentation
    
    IF validation succeeds:
      CONFIRM: "Working on {PROJECT_TYPE}/{PROJECT_NAME}"
      LOG: "Context variables set - PROJECT_TYPE: {PROJECT_TYPE}, PROJECT_NAME: {PROJECT_NAME}, AGENT_OS_PATH: {AGENT_OS_PATH}"
      PROCEED: to spec initiation
  </context_validation>
</context_detection_process>

<required_output_variables>
  After successful execution, these variables MUST be available:
  - PROJECT_TYPE: "apps" | "packages"
  - PROJECT_NAME: string (directory name under apps/ or packages/)
  - PROJECT_ROOT: string (relative path like "apps/simulator")
  - AGENT_OS_PATH: string (path like ".agent-os/apps/simulator")
</required_output_variables>

</step>

<step number="1" subagent="context-fetcher" name="spec_initiation">

### Step 1: Spec Initiation

Use the context-fetcher subagent to identify spec initiation method by either finding the next uncompleted roadmap item when user asks "what's next?" or accepting a specific spec idea from the user.

<option_a_flow>
  <trigger_phrases>
    - "what's next?"
  </trigger_phrases>
  <actions>
    1. CHECK @.agent-os/product/roadmap.md
    2. FIND next uncompleted item
    3. SUGGEST item to user
    4. WAIT for approval
  </actions>
</option_a_flow>

<option_b_flow>
  <trigger>user describes specific spec idea</trigger>
  <accept>any format, length, or detail level</accept>
  <proceed>to context gathering</proceed>
</option_b_flow>

</step>

<step number="2" subagent="context-fetcher" name="context_gathering">

### Step 2: Context Gathering (Conditional)

Use the context-fetcher subagent to read {AGENT_OS_PATH}/product/mission-lite.md and {AGENT_OS_PATH}/product/tech-stack.md only if not already in context to ensure minimal context for spec alignment.

<conditional_logic>
  IF both mission-lite.md AND tech-stack.md already read in current context:
    SKIP this entire step
    PROCEED to step 3
  ELSE:
    READ only files not already in context from current project:
      - {AGENT_OS_PATH}/product/mission-lite.md (if not in context)
      - {AGENT_OS_PATH}/product/tech-stack.md (if not in context)
    CONTINUE with context analysis
</conditional_logic>

<context_analysis>
  <mission_lite>core product purpose and value for current project {PROJECT_NAME}</mission_lite>
  <tech_stack>technical requirements for current project {PROJECT_NAME}</tech_stack>
</context_analysis>

</step>

<step number="3" subagent="context-fetcher" name="requirements_clarification">

### Step 3: Requirements Clarification

Use the context-fetcher subagent to clarify scope boundaries and technical considerations by asking numbered questions as needed to ensure clear requirements before proceeding.

<clarification_areas>
  <scope>
    - in_scope: what is included
    - out_of_scope: what is excluded (optional)
  </scope>
  <technical>
    - functionality specifics
    - UI/UX requirements
    - integration points
  </technical>
</clarification_areas>

<decision_tree>
  IF clarification_needed:
    ASK numbered_questions
    WAIT for_user_response
  ELSE:
    PROCEED to_date_determination
</decision_tree>

</step>

<step number="4" subagent="date-checker" name="date_determination">

### Step 4: Date Determination

Use the date-checker subagent to determine the current date in YYYY-MM-DD format for folder naming. The subagent will output today's date which will be used in subsequent steps.

<subagent_output>
  The date-checker subagent will provide the current date in YYYY-MM-DD format at the end of its response. Store this date for use in folder naming in step 5.
</subagent_output>

</step>

<step number="5" subagent="file-creator" name="spec_folder_creation">

### Step 5: Spec Folder Creation

Use the file-creator subagent to create directory: {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/ using the date from step 4.

Use kebab-case for spec name. Maximum 5 words in name.

<folder_naming>
  <format>YYYY-MM-DD-spec-name</format>
  <date>use stored date from step 4</date>
  <name_constraints>
    - max_words: 5
    - style: kebab-case
    - descriptive: true
  </name_constraints>
</folder_naming>

<example_names>
  - 2025-03-15-password-reset-flow
  - 2025-03-16-user-profile-dashboard
  - 2025-03-17-api-rate-limiting
</example_names>

</step>

<step number="6" subagent="file-creator" name="create_spec_md">

### Step 6: Create spec.md

Use the file-creator subagent to create the file: {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec.md using this template:

<file_template>
  <header>
    # Spec Requirements Document

    > Spec: [SPEC_NAME]
    > Created: [CURRENT_DATE]
  </header>
  <required_sections>
    - Overview
    - User Stories
    - Spec Scope
    - Out of Scope
    - Expected Deliverable
  </required_sections>
</file_template>

<section name="overview">
  <template>
    ## Overview

    [1-2_SENTENCE_GOAL_AND_OBJECTIVE]
  </template>
  <constraints>
    - length: 1-2 sentences
    - content: goal and objective
  </constraints>
  <example>
    Implement a secure password reset functionality that allows users to regain account access through email verification. This feature will reduce support ticket volume and improve user experience by providing self-service account recovery.
  </example>
</section>

<section name="user_stories">
  <template>
    ## User Stories

    ### [STORY_TITLE]

    As a [USER_TYPE], I want to [ACTION], so that [BENEFIT].

    [DETAILED_WORKFLOW_DESCRIPTION]
  </template>
  <constraints>
    - count: 1-3 stories
    - include: workflow and problem solved
    - format: title + story + details
  </constraints>
</section>

<section name="spec_scope">
  <template>
    ## Spec Scope

    1. **[FEATURE_NAME]** - [ONE_SENTENCE_DESCRIPTION]
    2. **[FEATURE_NAME]** - [ONE_SENTENCE_DESCRIPTION]
  </template>
  <constraints>
    - count: 1-5 features
    - format: numbered list
    - description: one sentence each
  </constraints>
</section>

<section name="out_of_scope">
  <template>
    ## Out of Scope

    - [EXCLUDED_FUNCTIONALITY_1]
    - [EXCLUDED_FUNCTIONALITY_2]
  </template>
  <purpose>explicitly exclude functionalities</purpose>
</section>

<section name="expected_deliverable">
  <template>
    ## Expected Deliverable

    1. [TESTABLE_OUTCOME_1]
    2. [TESTABLE_OUTCOME_2]
  </template>
  <constraints>
    - count: 1-3 expectations
    - focus: browser-testable outcomes
  </constraints>
</section>

</step>

<step number="7" subagent="file-creator" name="create_spec_lite_md">

### Step 7: Create spec-lite.md

Use the file-creator subagent to create the file: {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec-lite.md for the purpose of establishing a condensed spec for efficient AI context usage.

<file_template>
  <header>
    # Spec Summary (Lite)
  </header>
</file_template>

<content_structure>
  <spec_summary>
    - source: Step 6 spec.md overview section
    - length: 1-3 sentences
    - content: core goal and objective of the feature
  </spec_summary>
</content_structure>

<content_template>
  [1-3_SENTENCES_SUMMARIZING_SPEC_GOAL_AND_OBJECTIVE]
</content_template>

<example>
  Implement secure password reset via email verification to reduce support tickets and enable self-service account recovery. Users can request a reset link, receive a time-limited token via email, and set a new password following security best practices.
</example>

</step>

<step number="8" subagent="file-creator" name="create_technical_spec">

### Step 8: Create Technical Specification

Use the file-creator subagent to create the file: {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/sub-specs/technical-spec.md using this template:

<file_template>
  <header>
    # Technical Specification

    This is the technical specification for the spec detailed in @{AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec.md
  </header>
</file_template>

<spec_sections>
  <technical_requirements>
    - functionality details
    - UI/UX specifications
    - integration requirements
    - performance criteria
  </technical_requirements>
  <external_dependencies_conditional>
    - only include if new dependencies needed
    - new libraries/packages
    - justification for each
    - version requirements
  </external_dependencies_conditional>
</spec_sections>

<example_template>
  ## Technical Requirements

  - [SPECIFIC_TECHNICAL_REQUIREMENT]
  - [SPECIFIC_TECHNICAL_REQUIREMENT]

  ## External Dependencies (Conditional)

  [ONLY_IF_NEW_DEPENDENCIES_NEEDED]
  - **[LIBRARY_NAME]** - [PURPOSE]
  - **Justification:** [REASON_FOR_INCLUSION]
</example_template>

<conditional_logic>
  IF spec_requires_new_external_dependencies:
    INCLUDE "External Dependencies" section
  ELSE:
    OMIT section entirely
</conditional_logic>

</step>

<step number="9" subagent="file-creator" name="create_database_schema">

### Step 9: Create Database Schema (Conditional)

Use the file-creator subagent to create the file: {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/sub-specs/database-schema.md ONLY IF database changes needed for this task. But don't ever run the migration. All migrations should be run by the user.

<decision_tree>
  IF spec_requires_database_changes:
    CREATE {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/sub-specs/database-schema.md
  ELSE:
    SKIP this_step
</decision_tree>

<file_template>
  <header>
    # Database Schema

    This is the database schema implementation for the spec detailed in {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec.md
  </header>
</file_template>

<schema_sections>
  <changes>
    - new tables
    - new columns
    - modifications
    - migrations
  </changes>
  <specifications>
    - exact SQL or migration syntax
    - indexes and constraints
    - foreign key relationships
  </specifications>
  <rationale>
    - reason for each change
    - performance considerations
    - data integrity rules
  </rationale>
</schema_sections>

</step>

<step number="10" subagent="file-creator" name="create_api_spec">

### Step 10: Create API Specification (Conditional)

Use the file-creator subagent to create file: {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/sub-specs/api-spec.md ONLY IF API changes needed.

<decision_tree>
  IF spec_requires_api_changes:
    CREATE {AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/sub-specs/api-spec.md
  ELSE:
    SKIP this_step
</decision_tree>

<file_template>
  <header>
    # API Specification

    This is the API specification for the spec detailed in @{AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec.md
  </header>
</file_template>

<api_sections>
  <routes>
    - HTTP method
    - endpoint path
    - parameters
    - response format
  </routes>
  <controllers>
    - action names
    - business logic
    - error handling
  </controllers>
  <purpose>
    - endpoint rationale
    - integration with features
  </purpose>
</api_sections>

<endpoint_template>
  ## Endpoints

  ### [HTTP_METHOD] [ENDPOINT_PATH]

  **Purpose:** [DESCRIPTION]
  **Parameters:** [LIST]
  **Response:** [FORMAT]
  **Errors:** [POSSIBLE_ERRORS]
</endpoint_template>

</step>

<step number="11" name="user_review">

### Step 11: User Review

Request user review of spec.md and all sub-specs files, waiting for approval or revision requests.

<review_request>
  I've created the spec documentation for {PROJECT_NAME}:

  - Spec Requirements: @{AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec.md
  - Spec Summary: @{AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec-lite.md
  - Technical Spec: @{AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/sub-specs/technical-spec.md
  [LIST_OTHER_CREATED_SPECS]

  Please review and let me know if any changes are needed.

  When you're ready, run the /create-tasks command to have me build the tasks checklist from this spec.
</review_request>

</step>

<step number="12" subagent="file-creator" name="create_adr_optional">

### Step 12: Architecture Decision Record Creation (Optional)

Use the file-creator subagent to create or update ADRs based on significant architectural decisions made during spec creation. This step is OPTIONAL and should only be executed if the spec involves architecturally significant decisions.

<decision_tree>
  IF spec_contains_architecturally_significant_decisions:
    CREATE/UPDATE ADR files
  ELSE:
    SKIP this_step
</decision_tree>

<architecturally_significant_criteria>
  - Technology stack changes or additions
  - Data architecture or database design decisions
  - API design patterns or communication protocols
  - Security architecture choices
  - Performance or scalability architecture decisions
  - Integration patterns with external systems
  - Deployment or infrastructure architecture
</architecturally_significant_criteria>

<adr_creation_process>
  <file_location>
    {AGENT_OS_PATH}/product/decisions/YYYY-MM-DD-decision-title.md
  </file_location>
  
  <file_template>
    # ADR-[NUMBER]: [DECISION_TITLE]
    
    **Status:** Proposed | Accepted | Rejected | Deprecated | Superseded
    **Date:** [CURRENT_DATE]
    **Context:** [SPEC_NAME] - @{AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec.md
    
    ## Context and Problem Statement
    
    [DESCRIBE_THE_CONTEXT_AND_PROBLEM_REQUIRING_A_DECISION]
    
    ## Decision Drivers
    
    - [DRIVER_1]
    - [DRIVER_2]
    - [DRIVER_3]
    
    ## Considered Options
    
    - [OPTION_1]
    - [OPTION_2] 
    - [OPTION_3]
    
    ## Decision Outcome
    
    Chosen option: "[SELECTED_OPTION]", because [JUSTIFICATION].
    
    ### Positive Consequences
    
    - [POSITIVE_CONSEQUENCE_1]
    - [POSITIVE_CONSEQUENCE_2]
    
    ### Negative Consequences
    
    - [NEGATIVE_CONSEQUENCE_1]
    - [NEGATIVE_CONSEQUENCE_2]
    
    ## Pros and Cons of the Options
    
    ### [OPTION_1]
    
    - Good, because [ARGUMENT_A]
    - Good, because [ARGUMENT_B]
    - Bad, because [ARGUMENT_C]
    - ... <!-- numbers of pros and cons can vary -->
    
    ### [OPTION_2]
    
    - Good, because [ARGUMENT_A]
    - Good, because [ARGUMENT_B]
    - Bad, because [ARGUMENT_C]
    - ... <!-- numbers of pros and cons can vary -->
    
    ## Links
    
    - [Link type] [Link to ADR] <!-- example: Refined by [ADR-0005](0005-example.md) -->
    - [Specification] @{AGENT_OS_PATH}/specs/YYYY-MM-DD-spec-name/spec.md
  </file_template>
  
  <adr_numbering>
    - Check existing ADRs in {AGENT_OS_PATH}/product/decisions/
    - Use sequential numbering (ADR-0001, ADR-0002, etc.)
    - Maintain chronological order by date
  </adr_numbering>
  
  <adr_index_update>
    - Update {AGENT_OS_PATH}/product/decisions/README.md with new ADR entry
    - Maintain chronological list of all ADRs
    - Include status and brief description
  </adr_index_update>
</adr_creation_process>

<prompt_for_adr_creation>
  Based on the specification created, I've identified the following potential architectural decisions that may warrant ADR documentation:
  
  [LIST_IDENTIFIED_DECISIONS]
  
  Would you like me to create ADRs for any of these decisions? This will help maintain a historical record of architectural choices for future reference.
</prompt_for_adr_creation>

</step>

</process_flow>

<post_flight_check>
  EXECUTE: @.agent-os/instructions/meta/post-flight.md
</post_flight_check>
