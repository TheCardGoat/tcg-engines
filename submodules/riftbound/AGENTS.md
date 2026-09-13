# Riftbound Workspace

This workspace owns Riftbound catalog types, official-source ingestion, and
reference-card data. It does not own the generic manual tabletop protocol or
platform routing.

## Boundaries

- Card text, keywords, costs, and statistics are display/search metadata only.
- Never parse printed text into abilities, effects, triggers, targets, legal
  actions, automatic prompts, or other executable rule structures.
- Catalogs from the official Card Gallery or authenticated Riot content API
  must retain validated source provenance.
- Do not add community databases as fallback sources.
- Keep Riot credentials server-side and out of snapshots, logs, generated
  artifacts, and browser bundles.

## Validation

Run focused package tests first, then `vp run ci:check` from this workspace.
Live gallery checks are opt-in because they require network access. Authenticated
API checks require an explicitly provided development or production key.
