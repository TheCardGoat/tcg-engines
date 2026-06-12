# Memory Schema

Append entries to `bank.md` using this structure.

## Required Fields

- `date`: `YYYY-MM-DD`
- `task`
- `failure`
- `root_cause`
- `corrective_action`
- `preventive_guardrail`
- `verification`
- `handoff_notes`

## Entry Template

```markdown
## YYYY-MM-DD - <task>

- task: <what was attempted>
- failure: <what failed or nearly failed>
- root_cause: <why it failed>
- corrective_action: <what was changed>
- preventive_guardrail: <rule to avoid repeat>
- verification: <commands + pass/fail>
- handoff_notes: <what next skill should know>
```
