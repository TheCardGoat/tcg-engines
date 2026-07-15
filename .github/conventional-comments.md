# Code Review Guidelines

## Overview

This document establishes our code review standards using **Conventional Comments** to foster clear, constructive, and collaborative feedback. Well-structured comments improve communication, reduce misunderstandings, and make reviews more efficient.

## Why Conventional Comments?

Comments like this are unhelpful:
> "This is wrong."

By prefixing with a label, the intention becomes clear:
> **suggestion:** This could be improved.
> 
> Consider using the factory pattern here to reduce duplication.

Labeled comments:
- Make intentions explicit and unambiguous
- Encourage actionable, constructive feedback
- Are machine-parseable for tooling
- Save hours of miscommunication
- Improve team collaboration

## Format

```
<label> [decorations]: <subject>

[discussion]
```

**Components:**
- **label** (required): Single word indicating the comment type
- **decorations** (optional): Additional context in parentheses, comma-separated
- **subject** (required): The main message
- **discussion** (optional): Supporting context, reasoning, and next steps

### Example

```
question (non-blocking): At this point, does it matter which thread has won?

Maybe to prevent a race condition we should keep looping until they've all won?
```

## Labels

### Core Labels

| Label | Purpose | Example |
|-------|---------|---------|
| **praise:** | Highlight something positive. Leave at least one per review when genuine. | `praise: Excellent error handling here! The edge cases are well covered.` |
| **nitpick:** | Trivial preference-based requests. Always non-blocking. | `nitpick: Consider renaming 'data' to 'userData' for clarity.` |
| **suggestion:** | Propose specific improvements. Be explicit about what and why. | `suggestion: Let's extract this into a reusable hook.` |
| **issue:** | Identify specific problems (user-facing or internal). Pair with suggestions when possible. | `issue: This creates a memory leak in the event listener.` |
| **todo:** | Small, necessary changes that are trivial to implement. | `todo: Remove console.log before merging.` |
| **question:** | Seek clarification on potential concerns. | `question: Should we handle the null case here?` |
| **thought:** | Share ideas from reviewing. Always non-blocking but valuable for mentorship. | `thought: This pattern might work well in the auth module too.` |
| **chore:** | Reference required process steps. Link to documentation. | `chore: Please run the migration validator before merging.` |
| **note:** | Highlight something important. Always non-blocking. | `note: This will affect the mobile rendering differently.` |

### Extended Labels (Optional)

| Label | Purpose |
|-------|---------|
| **typo:** | Like **todo:**, but specifically for misspellings |
| **polish:** | Like **suggestion:**, but for immediate quality improvements |
| **quibble:** | Like **nitpick:**, for very minor points |

## Decorations

Decorations provide additional context to comments:

| Decoration | Meaning |
|------------|---------|
| **(non-blocking)** | Should not prevent approval. Use in organizations where comments are blocking by default. |
| **(blocking)** | Must be resolved before approval. Use in organizations where comments are non-blocking by default. |
| **(if-minor)** | Author should resolve only if changes are trivial. |
| **(security)** | Security-related concern |
| **(performance)** | Performance-related concern |
| **(accessibility)** | Accessibility concern |
| **(ux)** | User experience concern |
| **(test)** | Testing-related comment |

### Examples

```
suggestion (security): Consider sanitizing user input here to prevent XSS attacks.

Could we use the DOMPurify library instead of our own implementation?
```

```
issue (performance, non-blocking): This nested loop has O(n²) complexity.

Let's optimize this in a follow-up PR using a hash map approach.
```

## Communication Best Practices

### 1. Be Curious

Assume genuine curiosity, not certainty. Avoid stating opinions as facts.

❌ **Don't:**
```
suggestion: This bug should be fixed in the Main component. That will take less code.
```

✅ **Do:**
```
question: Could we solve this in the Main component? 

I wonder if that would be a more straightforward fix and require less code.
```

### 2. Use "We" Instead of "You"

Foster collaboration by using inclusive language.

❌ **Don't:**
```
issue: You should write tests for this.
```

✅ **Do:**
```
todo: We should write tests for this.

I can help write these if you'd like to pair on it.
```

**Why it matters:** "You should" can unconsciously sound like blame. "We" emphasizes shared ownership and collaboration.

### 3. Leave Actionable Comments

Make resolution paths crystal clear. If there's no obvious solution, say so explicitly.

❌ **Don't:**
```
issue: This doesn't look right.
```

✅ **Do:**
```
issue: The variable name 'data' is too generic and makes debugging difficult.

suggestion: Let's rename it to 'userProfileData' to match our naming conventions (see style-guide.md#naming).
```

### 4. Combine Similar Comments

Batch related feedback instead of leaving many small comments.

❌ **Don't:**
```
polish: m_foo should be foo
polish: m_bar should be bar
polish: m_baz should be baz
```

✅ **Do:**
```
polish: Let's remove Hungarian notation from all variables.

We decided not to use this pattern in our style guide. For example:
- m_foo → foo
- m_bar → bar
- m_baz → baz
```

### 5. Patient Mentoring Pays Off

Share knowledge with patience and kindness. Your tone in reviews ripples through the team culture.

✅ **Do:**
```
thought: The memoization pattern you used here is great!

For future reference, React.memo works best with pure components. Here's a good article on when to use it: [link]
```

### 6. Praise Genuinely and Often

Look for opportunities to recognize good work. Aim for at least one genuine praise per review.

✅ **Examples:**
```
praise: This edge case handling is thorough and well-tested!
```

```
praise: Great variable naming throughout this file - very readable!
```

```
praise: I love how you broke this down into smaller functions. Much easier to understand!
```

## Full Examples

### Example 1: Security Concern
```
issue (security, blocking): User input is not sanitized before rendering.

This creates an XSS vulnerability. We should use DOMPurify here:

import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

Reference: https://owasp.org/www-community/attacks/xss/
```

### Example 2: Architectural Suggestion
```
suggestion (non-blocking): Consider extracting this logic into a custom hook.

This pattern appears in 3 other components. A useFormValidation hook would:
- Reduce duplication
- Make testing easier
- Improve maintainability

Happy to handle this in a follow-up if you prefer.
```

### Example 3: Performance Note
```
note (performance): This implementation works, but heads up that it may be slow with large datasets.

With 10,000+ items, the filter/map chain could cause frame drops. If we see performance issues, we can optimize using virtualization or memoization.
```

### Example 4: Asking Questions
```
question: Why are we using setTimeout here instead of requestAnimationFrame?

I might be missing context, but RAF seems more appropriate for animation timing. Is there a specific reason for the current approach?
```

### Example 5: Combining Praise with Suggestion
```
praise: The error handling structure here is excellent!

suggestion (if-minor): We could make the error messages even more user-friendly by adding suggested actions:

"Failed to load user data. Please check your internet connection and try again."
```

## Review Workflow

### For Reviewers

1. **Start with praise** - Find something genuinely good
2. **Ask questions first** - Don't assume you have all context
3. **Be specific** - Vague feedback wastes everyone's time
4. **Distinguish blocking vs non-blocking** - Use decorations appropriately
5. **Suggest, don't command** - Foster collaboration
6. **Link to resources** - Help others learn and grow
7. **Review the code, not the person** - Use "we" language

### For Authors

1. **Respond to all comments** - Even if just acknowledging
2. **Ask for clarification** - If feedback is unclear
3. **Push back respectfully** - If you disagree, explain why
4. **Mark resolved** - Only after addressing the concern
5. **Say thanks** - Appreciate the reviewer's time and effort

## Anti-Patterns to Avoid

❌ **Vague comments**
```
This is wrong.
```

❌ **Passive-aggressive tone**
```
Obviously this won't work...
```

❌ **Commands instead of collaboration**
```
Change this to use Redux.
```

❌ **Nitpicking without labels**
```
I don't like this variable name.
```

❌ **Leaving only negative comments**
```
(No positive feedback in entire review)
```

## Tools and Automation

Comments following this format can be:
- Parsed by CI/CD tools
- Tracked for metrics (blocking vs non-blocking ratio)
- Filtered and searched programmatically
- Used for automated reporting

Example JSON parsing:
```json
{
  "label": "suggestion",
  "decorations": ["security", "blocking"],
  "subject": "Sanitize user input before rendering",
  "discussion": "This creates an XSS vulnerability..."
}
```

## Adapting These Guidelines

Feel free to:
- Add organization-specific labels or decorations
- Adjust what's considered blocking vs non-blocking
- Create custom labels for your domain (e.g., `legal:`, `compliance:`)
- Establish team-specific conventions

Keep the core format consistent for maximum benefit.

## Resources

- [Conventional Comments](https://conventionalcomments.org/)
- [Communication Best Practices](https://conventionalcomments.org/communication/)
- [Google Engineering Practices](https://github.com/google/eng-practices)

## Summary

Great code reviews are:
- **Clear** - Use labels to express intent
- **Constructive** - Provide actionable feedback
- **Collaborative** - Use "we" and ask questions
- **Kind** - Be patient and find opportunities to praise
- **Specific** - Give concrete examples and suggestions

Remember: Reviews are as much about building relationships and sharing knowledge as they are about catching bugs. Thoughtful, well-structured comments make everyone better developers.

---

*Last Updated: October 2025*

