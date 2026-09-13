# Animation simplification

Implement the approved shared-core, Gundam-first plan. Preserve AnimationPlanV2,
privacy, aspect ratio, replay inputs and game rules. Replace per-component
completion registration with one compiled timeline; use one overlay transfer
path; consolidate Gundam packet-to-plan mapping in the adapter; centralize
readable timings and sequences. Live playback catches up at a six-second backlog
or when returning to a visible tab; local and replay playback remain ordered.

Validation: focused runtime/UI/adapter tests, Gundam browser fixtures at desktop
and portrait mobile, other shared consumers' fixtures, then owning agnostic CI
checks/tests/builds. Record blockers and evidence before completion.

## Implemented

- One compiled timeline releases gameplay; removed playback registrations,
  watchdog coordination, and shared-layout transfer routing.
- One portal transfer uses captured card geometry, uniform scaling, face
  projection, eager Gundam artwork, and per-card reveal boundaries.
- One Gundam adapter mapper serves local/server events; centralized timings,
  ordered command stages, combat cleanup, setup deltas, and capped staggering.
- Live catch-up bounds queued playback at six seconds; sync, seek, tab return,
  resize, off/reduced motion, and unmount clean up presentation and audio.
- Added authoring documentation and focused regression/browser coverage.

## Validation evidence

- Owning formatting, lint, and configured type checks passed.
- All package/tool tests passed (25 workspace tasks); owning build passed.
- Full app run: 318 files / 2,834 tests passed; two failed. The Gundam failure
  used the previous 1.5-second duration limit; its updated timing test and all
  four focused animation files subsequently passed (32 tests).
- GrandArchiveConnectivity still fails because it queries a button named
  `Pass`, while the unchanged component renders `Pass Opportunity`. Its isolated
  retry confirms the failure. This unrelated test was left unchanged.
- Chromium: Gundam deployment, drag ownership, mulligan, resource placement,
  desktop/mobile art, reduced motion, command effect/cleanup; Cyberpunk transfer;
  Riftbound semantic steps; FAB animation/telemetry; One Piece practice route.
- Screenshots: `/tmp/gundam-animation-evidence/{desktop,mobile}-{start,active,settled}.png`.
- This is not a fresh visual audit of every historical inventory recipe or a
  production multiplayer validation. Shared live recovery has rendered-control
  test coverage. The full root gate and final geometry pass are recorded below.

## Final result

- Root `pnpm run ci:agnostic:check`: formatting/lint/configured types and all
  package tests pass; app tests finish with **319 files / 2,835 tests passing**,
  and only the existing Grand Archive button-name failure.
- After the final endpoint-geometry correction: shared animation tests **34/34**,
  focused app tests **32/32**, owning check and production build pass.
- Final Chromium run **12/12 passes** across Gundam, Cyberpunk, Riftbound,
  One Piece, and Flesh and Blood. The desktop/mobile tests assert that transfer
  artwork never grows beyond the larger endpoint and that controls unlock.
- Updated screenshots were visually inspected and copied to the evidence path
  above. A prior oversized overlay was fixed by allowing destination registration
  one frame before capture and measuring the actual entity inside its slot.

Implementation complete. The unrelated full-suite failure remains documented;
no production deployment or repository commit was performed.
