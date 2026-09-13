# Release-review fixture prerequisites

## Goal

Make every remaining ST10/GD05 release-review route stage the real cards and
state required to exercise the effect represented by that route.

## Scope

- Audit structured activation conditions, costs, qualifications, and directive
  target filters for every release-review card.
- Generate real supporting cards in the correct controller and zone.
- Stage pairing/link requirements and visible battle state for the route timing.
- Add a fixture audit that fails when a generated route lacks its declared
  prerequisites.
- Preserve card and engine behavior; this work changes simulator fixtures only.

## Validation

1. Focused release-review fixture and catalog tests.
2. Representative browser proof for the reported ST10 deploy/link routes.
3. Broad agnostic simulator check, reporting unrelated failures precisely.

## Outcome

- Added a data-driven prerequisite planner for all 220 release-review routes.
- The planner selects real cards for target filters, costs, zones, pair/link
  requirements, combat state, and turn-history conditions.
- Added explicit regression coverage for ST10-002, ST10-007, GD05-041,
  GD05-064, GD05-129, and GD05-130, plus a full route-construction audit.
- All 478 Gundam simulator fixture tests pass.
- Browser verification confirmed the ST10-002, ST10-007, and GD05-064 setups
  with no console errors.
- The package-wide TypeScript gate remains blocked by unrelated existing
  Cyberpunk, Flesh and Blood, protocol-version, adapter-resolution, and Gundam
  test errors; no errors remain in the files changed by this plan.
