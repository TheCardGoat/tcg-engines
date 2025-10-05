---
description: Address Pull Request Comments for Agent OS
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

## Objective
Analyze the current GitHub Pull Request associated with the active Git branch. Read all comments, description, and metadata. Determine whether each comment should be:
- ✅ **Addressed now**
- 📝 **Noted for follow-up**
- 🚫 **Declined with rationale**
- 🧹 **Ignored (obsolete/nit)**

Then, draft a concise response to each comment and produce a structured summary of decisions.

## 🛠️ Prompt: Analyze & Respond to Pull Request Feedback

> You are an AI engineering assistant integrated with Agent OS. Your task is to **review the current Pull Request (PR)** associated with the active Git branch and produce a comprehensive, actionable response.

### 🔍 Context Detection & Tooling
- **Infer the PR automatically**: Use the current Git branch name to identify the associated GitHub Pull Request.
- **Use available tooling**:
  - If `gh` (GitHub CLI) is available, run:
    ```bash
    gh pr view --json title,body,author,headRefName,baseRefName,comments,reviews,files
    ```
  - If an **MCP server** (e.g., GitHub MCP) is accessible, use it to fetch full PR metadata, including:
    - PR title and description
    - All line and general comments
    - Review statuses (approved, requested changes, comment)
    - File diffs
    - CI/check statuses (if relevant)

### 📝 Analysis Instructions

1.  **Read the full PR description**
    - Extract the stated intent, scope, and any open questions from the author.

2.  **Review every comment and review**
    For each comment (including outdated ones):
    - Classify its **type**:
      - ✅ **Clarification** (e.g., "Why did you choose X?")
      - 🛠️ **Actionable feedback** (e.g., "This function is inefficient")
      - 💡 **Suggestion** (e.g., "Consider using Y pattern")
      - ❓ **Misunderstanding** (based on incorrect assumptions)
      - 🧹 **Nitpick** (style, naming without functional impact)
    - Determine **response strategy**:
      - **Address now**: If it impacts correctness, security, performance, or violates team standards.
      - **Note for follow-up**: If it's valid but out of current scope (e.g., "We should refactor this module later").
      - **Politely decline with rationale**: If it's a preference without objective benefit or contradicts existing patterns.
      - **Ignore**: Only if clearly obsolete, duplicate, or based on outdated diff.

3.  **Draft a response to each comment**
    - Be **concise, respectful, and evidence-based**.
    - Reference code patterns, ADRs, or product specs from `.agent-os/product/` if applicable.
    - If agreeing, state: "Good catch—will update."
    - If declining, explain why (e.g., "We follow kebab-case per `.agent-os/product/decisions/...`").

4.  **Generate a PR Decision Summary**
    Produce a markdown summary with:

    ```markdown
    ## Pull Request Feedback Summary

    **PR**: #[NUMBER] - [TITLE]
    **Branch**: `[current-branch]`
    **Author**: @[author]

    ### 📌 Key Decisions
    - ✅ **Accepted & Addressed**: [N] comments (e.g., bug fixes, clarity improvements)
    - 📝 **Deferred to Follow-up**: [N] suggestions (e.g., tech debt, future refactors)
    - 🚫 **Declined with Rationale**: [N] items (e.g., stylistic preferences, out-of-scope)
    - 🧼 **Ignored**: [N] obsolete/nit comments

    ### 🛠️ Action Plan
    - [ ] Apply fixes for: [list key issues]
    - [ ] Create follow-up ticket for: [describe deferred work]
    - [ ] Push updated code or reply to comments as needed

    ### 💬 Sample Responses (for critical comments)
    > **Comment**: "Why not use Z library here?"
    > **Response**: "We avoid Z due to bundle size; see ADR-0012 on dependency policy."

    > **Comment**: "This test doesn't cover edge case X."
    > **Response**: "Agreed—adding test case now."
    ```

### 🎯 Output Requirements

- Output **only the final PR Decision Summary** in clean markdown.
- Do **not** include tooling commands or internal reasoning in the output.
- Ensure alignment with `.agent-os/product/mission.md` and `.agent-os/product/tech-stack.md` where relevant.

> Begin analysis now. Use the most reliable available method (GitHub CLI > MCP > fallback prompt) to fetch PR data.

For each comment, produce a polite, precise reply:

If ✅: “Good point—will update in next commit.”
If 📝: “Noted! This aligns with Phase 3 goals; I’ll track it in the roadmap.”
If 🚫: “We follow [X pattern] per ADR-0012 for consistency—happy to discuss offline.”
If 🧹: (No reply needed; mark as resolved.)