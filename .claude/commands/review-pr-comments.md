# PR Review Comments Handler

You are tasked with systematically reviewing and responding to Pull Request comments using the GitHub MCP server.

## Objectives
1. Analyze PRs one at a time
2. Identify all unanswered review comments
3. Analyze code suggestions and discussions
4. Respond to comments appropriately
5. Implement necessary changes based on feedback

## Process - FOLLOW STRICTLY IN ORDER

### Step 1: List Open Pull Requests
- Use the GitHub MCP server to list all open PRs in the repository
- Display them to the user with PR number, title, and author
- Ask the user which PR to analyze (if multiple exist)

### Step 2: Fetch PR Details
- Get the full PR details including:
  - Description and changes
  - Current review status
  - All review comments and discussions
  - Files changed

### Step 3: Identify Unanswered Comments
- Scan through ALL review comments
- Filter for comments that:
  - Have no reply from the PR author
  - Contain unresolved threads
  - Have pending change requests
  - Include code suggestions
- Create a numbered list of unanswered comments

### Step 4: Process Comments One at a Time
For EACH unanswered comment (process sequentially, never in parallel):

**4.1 Present the Comment**
- Show the comment text
- Show the file and line number context
- Show the code snippet being discussed
- Show any code suggestions provided by the reviewer

**4.2 Analyze the Comment**
- Determine the type: bug report, suggestion, question, code improvement, style issue
- Assess validity and impact
- Determine if code changes are needed

**4.3 Take Action**
Based on analysis:

**If it's a question:**
- Draft a clear, informative response
- Post the response to the PR comment thread using GitHub MCP

**If it's a valid code suggestion:**
- Show the current code
- Show the suggested change
- Implement the change using appropriate tools (Edit/Write)
- Run relevant tests to verify the change
- Post a response acknowledging the change with format:
  ```
  ✅ Implemented. [Brief description of what was changed]
  ```

**If it's a discussion point:**
- Analyze the trade-offs
- Draft a thoughtful response with technical justification
- Ask user for input if decision requires product/architectural judgment
- Post the agreed-upon response

**If changes are not needed:**
- Draft a respectful response explaining why
- Provide technical justification
- Post the response

**4.4 Mark as Processed**
- After responding/implementing, mark this comment as processed
- Move to the next unanswered comment

### Step 5: Verification
After processing all comments:
- Run test suite: `bun test`
- Run type checking: `bun run check-types`
- Run linting: `bun run lint`
- Fix any issues that arise
- Show summary of all changes made

### Step 6: Summary Report
Provide a structured summary:
```
PR Review Comments Summary
==========================
PR: #[number] - [title]

Comments Processed: [count]
- Questions answered: [count]
- Code changes implemented: [count]
- Discussions responded to: [count]

Changes Made:
- [file]: [description]
- [file]: [description]

All Tests: [PASSED/FAILED]
Type Check: [PASSED/FAILED]
Lint: [PASSED/FAILED]

Next Steps:
- [Any remaining actions needed]
```

## Important Rules

1. **ONE AT A TIME**: Never process multiple comments in parallel. Complete each comment fully before moving to the next.

2. **VERIFY CHANGES**: Always run tests after implementing code changes.

3. **CONTEXT AWARE**: Read the full file context before making changes, not just the commented lines.

4. **FOLLOW PROJECT STANDARDS**:
   - Use TDD approach
   - Follow TypeScript strict mode
   - Match existing code patterns
   - Follow CLAUDE.md guidelines

5. **COMMUNICATE CLEARLY**:
   - Keep responses professional and concise
   - Acknowledge good suggestions
   - Provide reasoning for decisions

6. **ASK WHEN UNCERTAIN**: If a comment requires product/architectural decisions, ask the user before responding.

7. **COMMIT STRATEGY**: DO NOT commit changes automatically. After all changes are complete and verified, ask the user if they want to commit.

## Example Flow

```
Step 1: Found 3 open PRs
- PR #123: Add new card implementation
- PR #124: Fix bug in game engine
- PR #125: Update documentation

Which PR should I analyze? [User selects #123]

Step 2: Analyzing PR #123...
Found 5 unanswered comments

Step 3: Processing comment 1/5
---
File: src/engine/card.ts:45
Reviewer: @john
Comment: "Should we add null checking here?"

[Shows code context]

Analysis: Valid safety concern. Adding null check.
[Implements change]
[Runs tests]
✅ Tests pass

Posting response: "✅ Implemented. Added null check for card reference."

Step 4: Processing comment 2/5...
[Continues one by one]
```

## Getting Started

Begin by using the GitHub MCP server to list all open pull requests in the current repository.
