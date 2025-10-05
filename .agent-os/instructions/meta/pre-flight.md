---
description: Common Pre-Flight Steps for Agent OS Instructions
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Pre-Flight Rules

- IMPORTANT: For any step that specifies a subagent in the subagent="" XML attribute you MUST use the specified subagent to perform the instructions for that step.

- Process XML blocks sequentially

- Read and execute every numbered step in the process_flow EXACTLY as the instructions specify.

- If you need clarification on any details of your current task, stop and ask the user specific numbered questions and then continue once you have all of the information you need.

- Use exact templates as provided

## Project Context Detection

<project_context_detection>

### Step 0: Determine Project Context

Before executing any Agent OS instructions, determine the current project context within the monorepo.

<detection_process>
  <current_directory_analysis>
    ACTION: Analyze current working directory and workspace root
    IDENTIFY: 
      - Monorepo root directory name (e.g., "lorcanito")
      - Project type (app vs package)
      - Actual project name (e.g., "lorcanary")
    DETERMINE: Project-specific Agent OS path
  </current_directory_analysis>

  <path_resolution_logic>
    STEP 1: Detect workspace root name
      GET workspace root directory name
      SET MONOREPO_ROOT = [workspace_root_name]
      NOTE: This is NOT the project name
      EXAMPLE: If workspace is "/Users/user/projects/lorcanito"
               Then MONOREPO_ROOT = "lorcanito"
    
    STEP 2: Detect or prompt for project context
      IF current_directory contains "apps/[name]" in path:
        SET PROJECT_TYPE = "apps"
        SET PROJECT_NAME = [name] (directory name after "apps/")
        SET PROJECT_ROOT = "apps/{PROJECT_NAME}"
        SET AGENT_OS_PATH = ".agent-os/apps/{PROJECT_NAME}"
        PROCEED to validation

      ELSE IF current_directory contains "packages/" in path:
        SET PROJECT_TYPE = "packages"

        IMPORTANT: Handle nested package structures correctly

        METHOD 1 (Preferred): Find deepest package.json
          - Search upward from current directory for package.json
          - Stop when reaching "packages/" directory
          - Use the directory name containing that package.json as PROJECT_NAME
          - Example: packages/engines/core-engine/ → PROJECT_NAME = "core-engine"

        METHOD 2 (Fallback): Use deepest directory name
          - Extract full path after "packages/"
          - Take the LAST directory component as PROJECT_NAME
          - Example: "packages/engines/core-engine" → PROJECT_NAME = "core-engine"
          - Example: "packages/shared" → PROJECT_NAME = "shared"

        CRITICAL: PROJECT_NAME must be the actual package name, not intermediate directories

        SET PROJECT_NAME = [deepest directory name after packages/]
        SET PROJECT_ROOT = [full path from packages/ to PROJECT_NAME]
        SET AGENT_OS_PATH = ".agent-os/packages/{PROJECT_NAME}"

        EXAMPLES:
          Path: packages/engines/core-engine/src/
          → PROJECT_NAME = "core-engine"
          → PROJECT_ROOT = "packages/engines/core-engine"
          → AGENT_OS_PATH = ".agent-os/packages/core-engine"

          Path: packages/shared/
          → PROJECT_NAME = "shared"
          → PROJECT_ROOT = "packages/shared"
          → AGENT_OS_PATH = ".agent-os/packages/shared"

        PROCEED to validation
      
      ELSE:
        PROMPT: "Which project are you working on? Please specify:
                 
                 Available in this monorepo:
                 - apps/simulator
                 - apps/server  
                 - apps/lorcanary
                 - apps/nakama
                 - packages/lorcana-engine
                 - packages/persistence
                 - packages/shared
                 
                 Format: [apps|packages]/[project-name]"
        
        WAIT: For user response
        PARSE: User response to extract PROJECT_TYPE and PROJECT_NAME
        SET: All context variables based on user input
        PROCEED to validation
  </path_resolution_logic>

  <context_variables>
    After detection, set these context variables for use in all instruction files:
    - MONOREPO_ROOT: string (workspace root directory name, e.g., "lorcanito")
    - PROJECT_TYPE: "apps" | "packages"
    - PROJECT_NAME: string (actual project directory name, e.g., "lorcanary")
    - PROJECT_ROOT: string (relative path like "apps/lorcanary" or "packages/engines/core-engine")
    - AGENT_OS_PATH: string (path to project's .agent-os directory, e.g., ".agent-os/apps/lorcanary" or ".agent-os/packages/core-engine")

    CRITICAL DISTINCTIONS:
      ❌ WRONG: Using MONOREPO_ROOT as PROJECT_NAME
      ✅ RIGHT: MONOREPO_ROOT and PROJECT_NAME are different

      ❌ WRONG: Using intermediate directory as PROJECT_NAME (e.g., "engines" in packages/engines/core-engine)
      ✅ RIGHT: PROJECT_NAME is the deepest/actual package name (e.g., "core-engine")

      ❌ WRONG: Creating .agent-os inside the package directory (e.g., packages/engines/core-engine/.agent-os/)
      ✅ RIGHT: .agent-os is always at monorepo root (e.g., .agent-os/packages/core-engine/)

      Example 1 (flat structure):
        MONOREPO_ROOT = "lorcanito" (workspace name)
        PROJECT_NAME = "lorcanary" (actual project we're working on)
        PROJECT_ROOT = "apps/lorcanary"
        AGENT_OS_PATH = ".agent-os/apps/lorcanary"

      Example 2 (nested structure):
        MONOREPO_ROOT = "tcg-engines" (workspace name)
        PROJECT_NAME = "core-engine" (actual package, NOT "engines")
        PROJECT_ROOT = "packages/engines/core-engine"
        AGENT_OS_PATH = ".agent-os/packages/core-engine"
  </context_variables>

  <validation_requirements>
    CRITICAL: All @core/ instruction files MUST have valid project context before execution.
    
    VALIDATE before proceeding with any @core/ instruction:
    1. MONOREPO_ROOT is set (for reference only)
    2. PROJECT_NAME is set and not empty
    3. PROJECT_NAME is NOT the same as MONOREPO_ROOT (common mistake!)
    4. PROJECT_TYPE is one of: "apps" | "packages"
    5. AGENT_OS_PATH exists and is accessible (e.g., ".agent-os/apps/lorcanary")
    6. PROJECT_ROOT contains a valid package.json
    
    IF validation fails:
      STOP execution immediately
      ERROR: "Core instruction requires valid project context. Please ensure you are in a valid project directory with proper .agent-os/ structure."
      PROVIDE: Instructions for project setup
  </validation_requirements>
</detection_process>

<path_substitution_rules>
  Throughout all instruction files, replace hardcoded paths:
  - ".agent-os/product/" → "{AGENT_OS_PATH}/product/"
  - ".agent-os/specs/" → "{AGENT_OS_PATH}/specs/"
  - ".agent-os/recaps/" → "{AGENT_OS_PATH}/recaps/"
  - ".agent-os/standards/" → ".agent-os/standards/" (always root-level shared)
  - ".agent-os/instructions/" → ".agent-os/instructions/" (always root-level shared)
</path_substitution_rules>

</project_context_detection>

## Context Confirmation (CRITICAL)

<context_confirmation>

### Step 0.5: Confirm Project Context with User

**MANDATORY**: After detecting context, ALWAYS display confirmation and wait for user approval before proceeding.

<confirmation_display_format>
  ═══════════════════════════════════════════
  📍 PROJECT CONTEXT CONFIRMATION
  ═══════════════════════════════════════════
  
  Monorepo:      {MONOREPO_ROOT}
  Working on:    {PROJECT_TYPE}/{PROJECT_NAME}
  Project Path:  {PROJECT_ROOT}
  Agent OS Path: {AGENT_OS_PATH}
  
  ═══════════════════════════════════════════
  
  All files will be created/modified within:
  → {AGENT_OS_PATH}/
  → {PROJECT_ROOT}/
  
  Is this correct? (yes/no)
</confirmation_display_format>

<confirmation_process>
  STEP 1: Display confirmation box with all context variables
  
  STEP 2: WAIT for user response
    - DO NOT PROCEED without explicit "yes" confirmation
    - DO NOT assume context is correct
    - DO NOT skip this step even if context seems obvious
  
  STEP 3: Handle response
    IF user says "yes":
      - Log: "Context confirmed: {PROJECT_NAME}"
      - Lock all context variables (immutable for session)
      - Proceed with instructions
    
    IF user says "no" or provides correction:
      - Parse user's corrected project context
      - Update all context variables
      - Re-display confirmation
      - WAIT again for "yes"
    
    IF user provides clarification:
      - Update context based on clarification
      - Re-display confirmation
      - WAIT for "yes"
</confirmation_process>

<context_locking>
  After user confirms "yes":
  
  1. Mark all context variables as LOCKED for this session
  2. Store in session memory for reference
  3. Validate EVERY file operation against locked context:
     - Before creating/modifying any file
     - Check path starts with {AGENT_OS_PATH} or {PROJECT_ROOT}
     - Reject operations outside confirmed project scope
  
  4. Log all file operations with project context:
     "[{PROJECT_NAME}] Creating file: {file_path}"
</context_locking>

<file_path_validation>
  BEFORE every file write/create operation:
  
  VALIDATE file_path:
    IF file_path starts with ".agent-os/":
      MUST match: "{AGENT_OS_PATH}/*"
      
      IF does not match:
        ERROR: "⚠️ PATH MISMATCH DETECTED
                
                Attempting to write: {file_path}
                Expected project: {PROJECT_NAME}
                Expected path: {AGENT_OS_PATH}
                
                This indicates a context confusion error.
                Cannot proceed with this operation."
        STOP: Execution immediately
        REQUEST: User to verify correct project context
    
    ELSE IF file_path starts with "apps/" OR "packages/":
      MUST match: "{PROJECT_ROOT}/*"
      
      IF does not match:
        ERROR: "⚠️ PATH MISMATCH DETECTED
                
                Attempting to write: {file_path}
                Expected project: {PROJECT_NAME}
                Expected path: {PROJECT_ROOT}
                
                This indicates a context confusion error.
                Cannot proceed with this operation."
        STOP: Execution immediately
        REQUEST: User to verify correct project context
</file_path_validation>

</context_confirmation>

## Enhanced Git Validation

For tasks requiring git operations, include enhanced pre-flight checks:

<enhanced_pre_flight>
  EXECUTE: @.agent-os/instructions/meta/enhanced-pre-flight.md
  WHEN: Any task involving code changes or git operations
  PURPOSE: Ensure clean git state and prevent branch conflicts
</enhanced_pre_flight>
