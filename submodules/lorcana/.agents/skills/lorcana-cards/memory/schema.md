# Memory Schema (Canonical)

This schema is shared across the Lorcana skills. Other skills reference this file and add only domain-specific addenda. The goal is a **living context** that distills durable learning across sessions, not a postmortem log.

## Tiers

Memory is organized in four tiers. Each tier has explicit promotion and decay rules.

| Tier               | Purpose                                                      | Lifespan                           | Loaded by default?     |
| ------------------ | ------------------------------------------------------------ | ---------------------------------- | ---------------------- |
| **Guardrails**     | Always-on, must-consider-every-session rules                 | Permanent until contradicted       | Yes (top of bank)      |
| **Promoted Rules** | Durable, evidence-backed claims about how the system behaves | Permanent until verification fails | Yes                    |
| **Candidates**     | Probationary patterns under observation                      | 60 days without reinforcement      | On task-relevance only |
| **Observations**   | Raw signals from a single session                            | 30 days                            | On task-relevance only |
| **Archive**        | Demoted, contradicted, or expired entries                    | Append-only audit trail            | No                     |

## File layout

```
memory/
  schema.md       # this file (or a one-line link to it from non-canonical skills)
  bank.md         # the live tiered store
  archive.md      # demoted/expired entries (append-only)
```

`bank.md` has fixed sections in this order:

1. `## Guardrails`
2. `## Promoted Rules`
3. `## Candidates`
4. `## Observations`

Anything outside these four sections is a structural error — fix it instead of inventing new headings.

## Entry format

### Guardrail

```markdown
- **G-NN**: <one-line rule>. Why: <reason>. Applies: <scope>.
```

Five to ten guardrails total. If the list grows past ten, demote the weakest.

### Promoted Rule

```markdown
### PR-NN — <slug>

- **claim**: <falsifiable statement about engine, DSL, or workflow>
- **scope**: <where it applies>
- **evidence**: <≥3 distinct signals — link by date/topic to Candidates or Observations>
- **verification**: <bash command or file:path that confirms still true>
- **last_checked**: YYYY-MM-DD
- **supersedes**: <PR-NN id, if replacing>
```

### Candidate

```markdown
### C-NN — <slug>

- **pattern**: <what was observed>
- **hits**: <count> (most recent: YYYY-MM-DD)
- **promote_when**: <criterion — usually "≥3 distinct events + verification passes">
- **demote_at**: YYYY-MM-DD (start_date + 60d)
```

### Observation

```markdown
### O-YYYY-MM-DD-<slug>

- **signal**: <what happened or was learned>
- **impact**: <what future work might change>
- **verification**: <command or evidence>
- **candidate_for**: <C-NN if reinforcing one, else "new">
```

## Promotion rules

- **Observation → Candidate**: same signal recurs ≥ 2× across distinct sessions, OR user explicitly marks decisive ("save this", "always do X").
- **Candidate → Promoted Rule**: ≥ 3 distinct supporting observations, AND verification command currently passes, AND no contradicting observation in the last 30 days.
- **Promoted Rule → Guardrail**: only by user request or when the rule is referenced ≥ 5× in subsequent observations within 90 days.

## Decay rules

- **Observations** older than 30 days move to `archive.md` unless they back a Candidate or Promoted Rule.
- **Candidates** with no new supporting event in 60 days move to `archive.md`.
- **Promoted Rules** are checked at every memory update: if `verification` fails or its cited file/symbol no longer exists, demote to Candidate and append a contradicting observation. After two failed checks in a row, archive.

## Memory update protocol

After substantive skill-guided work, in this order:

1. Append a new Observation (always — even if small).
2. If it reinforces a Candidate, increment `hits` and update its most-recent date.
3. If it contradicts a Promoted Rule, append a contradicting observation and run the demotion check.
4. Run the **stale sweep**:
   - Move expired Observations and Candidates to `archive.md`.
   - Re-verify a sample (≥1) of Promoted Rules whose `last_checked` is older than 14 days.
5. If a Candidate just crossed the promotion threshold, write a Promoted Rule and link it from the contributing observations.

Do not skip step 1. Observations are cheap; the system's value depends on a high-volume, lossy-by-design intake feeding a small, high-quality top.

## What does NOT belong in memory

- Code patterns derivable from `packages/lorcana/lorcana-types` or `lorcana-engine` source. Link to the file instead.
- Per-card narrative ("we implemented Belle today"). The git log is authoritative.
- Long verification command lists. Pick one canonical command per rule.
- Dated entries that read like a session journal with no future-relevance claim.

## Self-learning property

Each tier has a falsifiable transition. A Promoted Rule that no longer matches the codebase **demotes itself** at the next sweep, not at the next reader's discretion. This is the mechanism that keeps the bank from rotting.

If you find yourself wanting to add a memory entry that doesn't fit any tier, that's a signal the entry is either (a) better as a code comment, (b) better as a guardrail, or (c) not worth saving.
