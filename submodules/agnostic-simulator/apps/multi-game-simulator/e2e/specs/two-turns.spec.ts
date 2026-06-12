/**
 * E2E port of `packages/engine/tests/flow/two-turns.test.ts`.
 *
 * Walks the simulator from the gameStart fixture through SETUP → MULLIGAN →
 * two full turns per player. Each numeric assertion runs through
 * `simulator.expect*` helpers that check BOTH the engine state (via the
 * dev-only window bridge) AND the rendered DOM testid hooks. A pass means
 * the engine and the React tree agree; a divergence (e.g. engine says
 * hand=7 but UI renders 6 cards) fails the spec.
 *
 * First-player turn-1 carve-out matches the unit test: step 1 (READY SPENT
 * CARDS) is skipped on the first player's first turn so the setup-imposed
 * "two pre-spent legends" handicap survives until turn 3.
 */
import { test, expect } from "../fixtures/test";

test.describe("Flow — two turns per player from a fresh game", () => {
  test("walks the full sequence from setup through 4 half-turns", async ({ simulator }) => {
    await simulator.gotoFixture("gameStart");

    const first = await simulator.getActivePlayerId();
    const second = await simulator.getOpponentOf(first);

    // ── SETUP — initial state ────────────────────────────────────────────
    expect(await simulator.getPhase()).toBe("setup");
    expect(await simulator.getTurnNumber()).toBe(1);
    await simulator.expectHandSize(first, 6);
    await simulator.expectHandSize(second, 6);
    await simulator.expectFixerDiceCount(first, 6);
    await simulator.expectFixerDiceCount(second, 6);
    await simulator.expectGigCount(first, 0);
    await simulator.expectGigCount(second, 0);
    // CHOOSE PLAY ORDER: first player has 2 spent legends, rival has 0.
    expect(await simulator.getSpentLegendsCount(first)).toBe(2);
    expect(await simulator.getSpentLegendsCount(second)).toBe(0);
    // All 3 legend slots per side should be face-down at game start.
    await simulator.expectFaceDownLegendsCount(first, 3);
    await simulator.expectFaceDownLegendsCount(second, 3);

    // ── MULLIGAN CHANCE — both players take the optional mulligan ────────
    // mulligan() drives through the UI: click the side's "Mulligan" verb
    // button. The dispatch spy then verifies the click translated to the
    // right engine action — catches silent UI bugs (wrong button wired,
    // missing handler) that an engine-only assertion would miss.
    await simulator.clearDispatchLog();
    await simulator.mulligan(first);
    await simulator.expectLastDispatch({ type: "mulligan", as: first });
    expect(await simulator.getPhase()).toBe("setup"); // rival hasn't decided

    await simulator.mulligan(second);
    await simulator.expectLastDispatch({ type: "mulligan", as: second });
    // Both decided → engine auto-advances to start phase for the first player.
    // Step 1 (READY) is skipped on turn 1; step 2 (DRAW) fires; step 3 (GAIN A
    // GIG) opens a pending choice.
    expect(await simulator.getPhase()).toBe("start");
    expect(await simulator.getActivePlayerId()).toBe(first);
    expect(await simulator.getTurnNumber()).toBe(1);

    // ── TURN 1 (first player) — START PHASE ──────────────────────────────
    // Step 1: READY SPENT CARDS → SKIPPED on first player's turn 1.
    expect(await simulator.getSpentLegendsCount(first)).toBe(2);
    // Step 2: DRAW → 6 + 1 = 7.
    await simulator.expectHandSize(first, 7);
    // Step 3: GAIN A GIG — pending choice open; d20 must be taken last.
    {
      const allowed = await simulator.getAllowedGigDice(first);
      expect(allowed.map((d) => d.dieType)).not.toContain("d20");
      expect(allowed.length).toBe(5);
    }
    // Fixer still 6, gig 0 until the player picks.
    await simulator.expectFixerDiceCount(first, 6);
    await simulator.expectGigCount(first, 0);

    // gainGig() now drives through the UI: click a candidate die in the
    // FixerZone (the prompt banner offers an equivalent button row). Spy
    // verifies the click translated to `gainGig` with the right die id.
    await simulator.clearDispatchLog();
    const firstDie = await simulator.pickFirstAllowedDie(first);
    await simulator.gainGig(firstDie, first);
    await simulator.expectLastDispatch({ type: "gainGig", dieId: firstDie, as: first });
    await simulator.expectFixerDiceCount(first, 5);
    await simulator.expectGigCount(first, 1);
    expect(await simulator.getPendingChoiceType(first)).toBeNull();

    // Second player's state untouched until their first turn begins.
    await simulator.expectHandSize(second, 6);
    await simulator.expectFixerDiceCount(second, 6);
    await simulator.expectGigCount(second, 0);

    // UI sanity: the active side's board reflects the engine's prompt
    // status. With the gainGig pending choice resolved, the active side is
    // in select-action mode (passPhase available).
    await simulator.expectActiveBoardMode("select-action");

    // MAIN PHASE → end of turn.
    // passPhase() also UI-driven; spy-check on the first one as a sample.
    await simulator.clearDispatchLog();
    await simulator.passPhase(first);
    await simulator.expectLastDispatch({ type: "passPhase", as: first });

    // ── TURN 1 (second player) — START PHASE (full, all 3 steps) ─────────
    expect(await simulator.getActivePlayerId()).toBe(second);
    expect(await simulator.getTurnNumber()).toBe(2);
    expect(await simulator.getPhase()).toBe("start");
    // Step 1: READY → second player had nothing spent.
    expect(await simulator.getSpentLegendsCount(second)).toBe(0);
    // Step 2: DRAW → 6 + 1 = 7.
    await simulator.expectHandSize(second, 7);
    // Step 3: GAIN A GIG.
    await simulator.gainGig(await simulator.pickFirstAllowedDie(second), second);
    await simulator.expectFixerDiceCount(second, 5);
    await simulator.expectGigCount(second, 1);

    // UI sanity: control has flipped — the rival board is now active.
    await simulator.expectActiveBoardMode("select-action");

    await simulator.passPhase(second);

    // ── TURN 2 (first player) — START PHASE (full, all 3 steps) ──────────
    expect(await simulator.getActivePlayerId()).toBe(first);
    expect(await simulator.getTurnNumber()).toBe(3);
    expect(await simulator.getPhase()).toBe("start");
    // Step 1: READY → the two pre-spent legends finally ready up.
    expect(await simulator.getSpentLegendsCount(first)).toBe(0);
    // Step 2: DRAW → 7 + 1 = 8.
    await simulator.expectHandSize(first, 8);
    // Step 3: GAIN A GIG.
    await simulator.gainGig(await simulator.pickFirstAllowedDie(first), first);
    await simulator.expectFixerDiceCount(first, 4);
    await simulator.expectGigCount(first, 2);

    await simulator.passPhase(first);

    // ── TURN 2 (second player) — START PHASE ─────────────────────────────
    expect(await simulator.getActivePlayerId()).toBe(second);
    expect(await simulator.getTurnNumber()).toBe(4);
    expect(await simulator.getPhase()).toBe("start");
    // Step 1: READY → second player had nothing spent.
    expect(await simulator.getSpentLegendsCount(second)).toBe(0);
    // Step 2: DRAW → 7 + 1 = 8.
    await simulator.expectHandSize(second, 8);
    // Step 3: GAIN A GIG.
    await simulator.gainGig(await simulator.pickFirstAllowedDie(second), second);
    await simulator.expectFixerDiceCount(second, 4);
    await simulator.expectGigCount(second, 2);

    await simulator.passPhase(second);

    // ── End state — turn 5 about to start (first player) ─────────────────
    expect(await simulator.getTurnNumber()).toBe(5);
    expect(await simulator.getActivePlayerId()).toBe(first);
    // First player: 2 completed start phases (T1 carve-out skips step 1,
    // T3 fires all three) + draw on T5. Hand 6 + 3 = 9. Fixer/gig reflect
    // 2 takes (T1, T3); the T5 take is still pending.
    await simulator.expectHandSize(first, 9);
    await simulator.expectFixerDiceCount(first, 4);
    await simulator.expectGigCount(first, 2);
    expect(await simulator.getPendingChoiceType(first)).toBe("gainGig");
    // Second player: 2 start phases (T2, T4) — hand 8, fixer 4, gig 2.
    await simulator.expectHandSize(second, 8);
    await simulator.expectFixerDiceCount(second, 4);
    await simulator.expectGigCount(second, 2);

    expect(await simulator.isGameOver()).toBe(false);
  });
});
