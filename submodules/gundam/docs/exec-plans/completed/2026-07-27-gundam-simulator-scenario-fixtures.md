# Gundam Simulator Scenario Fixtures

## Goal

Make the Gundam simulator fixture bench a dependable game-testing surface:
named routes must open directly at intentional game points, explain the
behavior under test, and cover setup, the Main Phase, battles, effects,
prompts, automation, and the End Phase.

## Constraints

- Keep Gundam state construction and terminology game-native.
- Keep shared simulator contracts and UI game-agnostic.
- Preserve `/gundam/simulator` as the player-facing VS AI launcher.
- Use first-class `/gundam/simulator/tests/:fixtureId` routes for fixtures.
- Preserve unrelated dirty-worktree changes.
- Fixture state may be injected, but it must be internally coherent and
  exercise the public runtime moves after boot.

## Work

1. Add typed scenario metadata for every indexed Gundam fixture, including its
   group, start point, purpose, and manual test instructions.
2. Route named fixtures through `/tests/:fixtureId` while retaining the
   existing query route only as a temporary internal compatibility path.
3. Add a representative End Phase fixture so the catalog covers every turn
   phase family relevant to interaction testing.
4. Add integrity tests that build the full catalog, reject synthetic runtime
   card definitions, ensure non-setup fixtures leave setup, and assert exact
   phase/step and available moves for representative scenarios.
5. Browser-check the catalog and representative setup, Main Phase, Block Step,
   prompt/effect, and End Phase states.

## Evidence

- The focused route, catalog, real-card, and integrity suite passed: 6 files,
  100 tests.
- The integrity suite built all 40 indexed scenarios, rejected synthetic
  runtime definitions, verified documented phase families and representative
  public moves, and successfully declared a real Demi Trainer block.
- Focused `vp check --no-fmt` passed with no warnings, lint errors, or type
  errors in the changed route and fixture files.
- Local browser proof opened setup, Main Phase, Block Step, optional
  Development, private Deck-look, and End Phase routes directly. Gundam Delta
  Kai exposed real Resolve/Skip choices, and The Path to Victory or Defeat
  exposed five viewer-private Deck cards.
- Four additional legacy behavior tests produced three passing files and two
  failures in `deploy-unit.test.tsx`. Both failures reflect the concurrent UI
  branch baseline: the test still queries the removed "Your resource area"
  accessible name and the retired synthetic "RX-78-2" fixture label.
