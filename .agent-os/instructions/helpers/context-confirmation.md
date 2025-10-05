---
description: Context Confirmation Helper for Monorepo Projects
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Context Confirmation Helper

## Overview

This helper ensures AI agents explicitly confirm project context before taking actions, preventing mistakes in monorepo setups where multiple projects coexist.

## The Problem

In a monorepo with multiple projects (e.g., `apps/lorcanary`, `apps/simulator`, `packages/lorcana-engine`), AI agents can:
- Confuse the monorepo root name with the actual project name
- Write files to the wrong project's `.agent-os/` directory
- Mix up similar project names (e.g., "lorcanito" vs "lorcanary")
- Operate on the wrong project without realizing it

## The Solution: Explicit Confirmation

### Step 1: Detect and Set Context Variables

```xml
<context_detection>
  ACTION: Analyze current working directory and user intent
  
  DETECT:
    - MONOREPO_ROOT: The root directory name (e.g., "lorcanito")
    - PROJECT_TYPE: "apps" or "packages"
    - PROJECT_NAME: The actual project directory name (e.g., "lorcanary")
    - PROJECT_ROOT: Relative path (e.g., "apps/lorcanary")
    - AGENT_OS_PATH: Project-specific path (e.g., ".agent-os/apps/lorcanary")
</context_detection>
```

### Step 2: Display Context Confirmation

**CRITICAL**: Before executing ANY file operations, display this confirmation:

```xml
<context_confirmation_display>
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
</context_confirmation_display>
```

### Step 3: Wait for User Confirmation

```xml
<confirmation_requirement>
  WAIT: For user to confirm with "yes" or provide correction
  
  IF user says "no" or provides correction:
    - Parse corrected project context
    - Update all context variables
    - Re-display confirmation
    - Wait again for "yes"
  
  IF user says "yes":
    - Lock context variables (immutable for this session)
    - Log confirmation: "Context confirmed: {PROJECT_NAME}"
    - Proceed with instructions
</confirmation_requirement>
```

## Integration with Core Instructions

Add this step **immediately after pre-flight** in all core instructions:

```xml
<step number="0.5" name="context_confirmation">

### Step 0.5: Confirm Project Context

Use @.agent-os/instructions/helpers/context-confirmation.md to display and confirm project context before proceeding.

<confirmation_display>
  ═══════════════════════════════════════════
  📍 PROJECT CONTEXT CONFIRMATION
  ═══════════════════════════════════════════
  
  Monorepo:      {MONOREPO_ROOT}
  Working on:    {PROJECT_TYPE}/{PROJECT_NAME}
  Project Path:  {PROJECT_ROOT}
  Agent OS Path: {AGENT_OS_PATH}
  
  ═══════════════════════════════════════════
  
  All spec files will be created in:
  → {AGENT_OS_PATH}/specs/
  
  All code changes will be made in:
  → {PROJECT_ROOT}/src/
  
  Is this correct? (yes/no)
</confirmation_display>

<instructions>
  ACTION: Display context confirmation
  WAIT: For user to confirm "yes"
  IF NO: Re-detect context based on user correction
  IF YES: Lock context and proceed
</instructions>

</step>
```

## Context Locking

Once confirmed, context variables become **immutable** for the session:

```xml
<context_lock>
  After user confirms "yes":
  
  1. Mark all context variables as LOCKED
  2. Log: "Context locked: {PROJECT_NAME}"
  3. Store in session memory
  4. Validate before EVERY file operation:
     - Check path starts with {AGENT_OS_PATH} or {PROJECT_ROOT}
     - Reject operations outside project scope
     - Display warning if mismatch detected
</context_lock>
```

## Validation Before File Operations

Before creating/modifying ANY file:

```xml
<file_operation_validation>
  BEFORE writing to file_path:
    
    VALIDATE:
      IF file_path starts with ".agent-os/":
        MUST start with {AGENT_OS_PATH}
        REJECT if starts with different project path
        
      ELSE IF file_path starts with "apps/" or "packages/":
        MUST start with {PROJECT_ROOT}
        REJECT if starts with different project path
        
    IF validation fails:
      ERROR: "File path mismatch detected!
              Attempting to write: {file_path}
              Expected project: {PROJECT_NAME}
              Expected paths: {AGENT_OS_PATH} or {PROJECT_ROOT}
              
              This indicates a context confusion error."
      STOP: Execution immediately
      REQUEST: User to verify correct project context
</file_operation_validation>
```

## Example Scenarios

### ✅ Correct Usage

```
User working directory: /Users/user/projects/lorcanito/
Current project: apps/lorcanary

Context Detected:
- MONOREPO_ROOT: "lorcanito"
- PROJECT_TYPE: "apps"
- PROJECT_NAME: "lorcanary"
- PROJECT_ROOT: "apps/lorcanary"
- AGENT_OS_PATH: ".agent-os/apps/lorcanary"

File operations:
✓ .agent-os/apps/lorcanary/specs/2025-10-01-my-decks-v2/spec.md
✓ apps/lorcanary/src/components/MyDeckCard.tsx
✗ .agent-os/apps/lorcanito/... (REJECTED - wrong project)
✗ .agent-os/apps/simulator/... (REJECTED - different project)
```

### ⚠️ Prevented Mistake

```
AI detects: "lorcanito" as project name (WRONG - this is monorepo)
Displays confirmation showing:
  Working on: apps/lorcanito
  Agent OS Path: .agent-os/apps/lorcanito

User sees mismatch, responds: "no, it's apps/lorcanary"

AI re-detects:
  Working on: apps/lorcanary
  Agent OS Path: .agent-os/apps/lorcanary

User confirms: "yes"

✓ Mistake prevented before any files were created
```

## Implementation Checklist

For each core instruction file:

- [ ] Add Step 0.5: Context Confirmation (after pre-flight)
- [ ] Display formatted context box
- [ ] Wait for user "yes" confirmation
- [ ] Lock context variables after confirmation
- [ ] Validate all file paths against locked context
- [ ] Include project name in all file operation logs

## Error Messages

### Context Mismatch Detected

```
⚠️ CONTEXT MISMATCH DETECTED

Attempted operation: Create file at {attempted_path}
Expected project: {PROJECT_NAME}
Expected base path: {AGENT_OS_PATH} or {PROJECT_ROOT}

This file path does not match the confirmed project context.

Possible causes:
1. AI confused monorepo name with project name
2. Working on wrong project
3. Path calculation error

Please verify the correct project and try again.
```

### No Context Confirmation

```
❌ CONTEXT NOT CONFIRMED

Cannot proceed with file operations without explicit project context confirmation.

Please run context confirmation step first:
@.agent-os/instructions/helpers/context-confirmation.md
```

## Benefits

1. **Prevents mistakes before they happen** - User catches errors early
2. **Clear visibility** - Formatted display makes context obvious
3. **Immutable context** - Once confirmed, can't drift during execution
4. **Path validation** - Every file operation is checked
5. **Better logging** - Project name included in all operations
6. **User trust** - Explicit confirmation builds confidence

## Usage in Instructions

Every core instruction should follow this pattern:

```xml
<pre_flight_check>
  EXECUTE: @.agent-os/instructions/meta/pre-flight.md
</pre_flight_check>

<context_confirmation_check>
  EXECUTE: @.agent-os/instructions/helpers/context-confirmation.md
  CRITICAL: Must complete before proceeding with any file operations
</context_confirmation_check>

<process_flow>
  <!-- Rest of instruction steps -->
</process_flow>
```

