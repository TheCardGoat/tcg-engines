---
description: Enhanced Pre-Flight Steps with Git State Validation for Agent OS Instructions
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Enhanced Pre-Flight Rules

## Core Pre-Flight Requirements
- IMPORTANT: For any step that specifies a subagent in the subagent="" XML attribute you MUST use the specified subagent to perform the instructions for that step.
- Process XML blocks sequentially
- Read and execute every numbered step in the process_flow EXACTLY as the instructions specify.
- If you need clarification on any details of your current task, stop and ask the user specific numbered questions and then continue once you have all of the information you need.
- Use exact templates as provided

## Git State Validation (Pre-Task)

<git_state_validation>

### Step 0: Git Repository State Check

Before starting any new task, perform comprehensive git state validation to ensure clean starting conditions.

<validation_process>

<sub_step number="0.1" name="main_branch_sync">

#### Ensure Latest Main Branch

<instructions>
  ACTION: Switch to main branch and pull latest changes
  COMMANDS:
    - `git checkout main`
    - `git pull origin main`
  VERIFY: No merge conflicts or uncommitted changes
  FAIL_ACTION: Stop and request user intervention
</instructions>

</sub_step>

<sub_step number="0.2" name="previous_work_verification">

#### Verify Previous Task Integration

If this is a continuation of previous work or part of a multi-task spec:

<instructions>
  ACTION: Check if previous task's code exists in main branch
  METHOD: Search for key files/changes from previous tasks
  VERIFICATION:
    - Use grep/file search to verify previous implementations exist
    - Check that expected files from previous tasks are present
    - Validate that previous functionality is integrated
  
  IF_NOT_FOUND:
    ACTION: Stop execution
    MESSAGE: "Previous task code not found in main branch. Please ensure previous PR is merged before continuing."
    WAIT: For user confirmation that PR is merged
    RETRY: Validation after user confirms
</instructions>

<search_patterns>
  <database_migrations>Check for new migration files</database_migrations>
  <new_endpoints>Search for API endpoints from previous tasks</new_endpoints>
  <new_components>Look for React components from previous tasks</new_components>
  <configuration_changes>Verify config updates from previous tasks</configuration_changes>
</search_patterns>

</sub_step>

<sub_step number="0.3" name="unique_branch_creation">

#### Create Unique Task Branch

Each task must have its own unique branch to avoid merge conflicts and maintain clean git history.

<branch_naming_strategy>
  <format>[spec-folder-name]-task-[task-number]</format>
  <examples>
    - postgame-persistence-migration-task-1
    - postgame-persistence-migration-task-2
    - user-authentication-task-1
  </examples>
</branch_naming_strategy>

<instructions>
  ACTION: Create unique branch for current task
  NAMING: Use spec folder name + task identifier
  COMMANDS:
    - `git checkout -b [spec-name]-task-[number]`
  VERIFY: Branch created successfully from latest main
  DOCUMENT: Branch name for later use in git-workflow
</instructions>

</sub_step>

</validation_process>

<failure_handling>
  <dirty_working_directory>
    ACTION: Stash or commit changes before switching branches
    MESSAGE: "Working directory not clean. Please commit or stash changes."
  </dirty_working_directory>
  
  <merge_conflicts>
    ACTION: Stop execution
    MESSAGE: "Merge conflicts detected. Please resolve manually."
    REQUIRE: User intervention
  </merge_conflicts>
  
  <missing_previous_work>
    ACTION: Stop execution
    MESSAGE: "Previous task code not integrated. Please merge previous PR first."
    WAIT: User confirmation of merge
  </missing_previous_work>
</failure_handling>

</git_state_validation>

## Integration Points

This enhanced pre-flight integrates with:
- **git-workflow.md**: Uses unique branch names created here
- **post-execution-tasks.md**: Ensures clean state before task execution
- **create-tasks.md**: Coordinates with task breakdown and sequencing

## User Interaction Requirements

<user_prompts>
  <pr_merge_required>
    "⚠️ Previous task code not found in main branch. 
    
    Please:
    1. Review and merge the previous PR
    2. Confirm merge completion
    3. Type 'continue' to proceed with validation
    
    Previous PR should contain: [EXPECTED_CHANGES_SUMMARY]"
  </pr_merge_required>
  
  <branch_cleanup>
    "✅ Task completed successfully!
    
    Recommendation: Delete the task branch after PR merge:
    `git branch -d [branch-name]`"
  </branch_cleanup>
</user_prompts>
