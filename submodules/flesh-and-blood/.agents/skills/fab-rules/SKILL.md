---
name: "fab-rules"
description: "Explain and cite Flesh and Blood rules using indexed references, including official release notes and errata bulletins. Use when answering mechanic questions, resolving card interactions, interpreting keywords, or deriving constraints from official rules material."
---

# Flesh and Blood Rules

Use the glossary and indexed references first, then load only the required deep
sections. For a card-specific ruling, always check errata before interpreting
printed text, the Comprehensive Rules, or a release note.

## Required Loading

1. Read `references/glossary.md` and keep the terms in context for the full task.
2. Read `indexes/master-index.md`.
3. If a named card, token, or set mechanic is involved, search
   `references/errata-bulletins.md` before opening any other source.
4. Use the master index to identify exact rule references before opening a
   comprehensive-rules chapter or the relevant section of
   `references/release-notes.md`.

## Source Priority

1. `references/errata-bulletins.md` — official errata bulletins. **Errata is
   authoritative over every other local reference**, including a conflicting
   Comprehensive Rules passage or release note.
2. `references/flesh-and-blood-comprehensive-rules/` (official Comprehensive Rules, rules.fabtcg.com/en/cr/)
3. `references/flesh-and-blood-comprehensive-rules/glossary.md` (official glossary)
4. `references/release-notes.md` — official set release notes. These explain
   a release's intended interactions but are historical snapshots and may not
   reflect later rules or policy changes.

Never use a release note to override an erratum. If a live official source has
changed, refresh the corresponding local source index; do not silently invent
a reconciliation.

## Retrieval Flow

1. Start at `references/glossary.md`, then `indexes/master-index.md`.
2. For any card-specific or set-specific question, search
   `references/errata-bulletins.md` first. Cite its bulletin number and URL.
3. When the index identifies a relevant source, open only that file under
   `references/official-updates/errata/` or
   `references/official-updates/release-notes/`; do not load the whole archive.
4. Use the Topic Quick Reference in the master index for gameplay questions.
5. Open only the minimal Comprehensive Rules chapter and local update document
   needed for the final answer.
6. Cite Comprehensive Rules as `Chapter.Section.Rule` (for example `7.5.2`),
   errata as `Errata Bulletin #N`, and release notes as `Release Notes — Set`.

## Output Modes

### Mode A: Player/Rules Explanation

Return:

- concise ruling
- rule citations (`Chapter.Section.Rule` style)
- caveats and edge conditions

### Mode B: Implementation Handoff

Return this JSON:

```json
{
  "citations": ["2.8.1", "7.5.2"],
  "behaviorConstraints": ["constraint statement"],
  "testImplications": ["what must be asserted"],
  "ambiguities": ["open interpretation risk"]
}
```

## Quality Rules

- Never provide rule guidance without citations when references exist.
- When an erratum applies, state that it supersedes the conflicting source and
  use the errata'd text/behavior, even if the physical printing differs.
- Distinguish confirmed rule text from inference.
- If references are insufficient, explicitly mark uncertainty.
- Do not import assumptions from another TCG when the Flesh and Blood rules are silent.
- Preserve Flesh and Blood wording for native concepts such as pitch, combat chain, chain link, arsenal, and go again.
- This workspace owns the card catalog, not an engine. Rules interpretations inform catalog metadata, keyword terminology, and display copy only; never parse printed text into executable rule structures.
