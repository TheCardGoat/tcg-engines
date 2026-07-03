/**
 * E2E port of `packages/engine/tests/flow/two-turns.test.ts` using the new
 * InteractionPanel-driven POM.
 *
 * Walks the simulator from the gameStart fixture through SETUP → MULLIGAN →
 * two full turns per player. Each numeric assertion runs through the POM's
 * `expect*` helpers that check BOTH the engine state and the rendered DOM.
 */
import { test, expect } from "@playwright/test";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import type { PlayerId } from "@tcg/cyberpunk-engine";

test.describe("Flow — two turns per player from a fresh game", () => {
  test("walks the full sequence from setup through 4 half-turns", async ({ page }) => {
    const pom = await createPlaywrightCyberpunkSimulatorPom(page, {
      fixture: { scenarioId: "gameStart" },
    });

    const first = await pom.getActivePlayerId();
    const second = await pom.getOpponentOf(first);

    // ── SETUP — initial state ────────────────────────────────────────────
    expect(await pom.getPhase()).toBe("setup");
    expect(await pom.getTurnNumber()).toBe(1);
    await pom.expectHandSize(first, 6);
    await pom.expectHandSize(second, 6);
    await pom.expectFixerDiceCount(first, 6);
    await pom.expectFixerDiceCount(second, 6);
    await pom.expectGigCount(first, 0);
    await pom.expectGigCount(second, 0);
    expect(await getSpentLegendsCount(pom, first)).toBe(2);
    expect(await getSpentLegendsCount(pom, second)).toBe(0);
    await pom.expectFaceDownLegendsCount(first, 3);
    await pom.expectFaceDownLegendsCount(second, 3);

    // ── MULLIGAN CHANCE ──────────────────────────────────────────────────
    await pom.clearDispatchLog();
    await pom.mulligan(first);
    await pom.expectLastDispatch({ type: "mulligan", as: first });
    expect(await pom.getPhase()).toBe("setup");

    await pom.mulligan(second);
    await pom.expectLastDispatch({ type: "mulligan", as: second });
    expect(await pom.getPhase()).toBe("start");
    expect(await pom.getActivePlayerId()).toBe(first);
    expect(await pom.getTurnNumber()).toBe(1);

    // ── TURN 1 (first player) — START PHASE ──────────────────────────────
    expect(await getSpentLegendsCount(pom, first)).toBe(2);
    await pom.expectHandSize(first, 7);
    {
      const allowed = await pom.getAllowedGigDice(first);
      expect(allowed.map((d) => d.dieType)).not.toContain("d20");
      expect(allowed.length).toBe(5);
    }
    await pom.expectFixerDiceCount(first, 6);
    await pom.expectGigCount(first, 0);

    await pom.clearDispatchLog();
    const firstDie = await pom.pickFirstAllowedDie(first);
    await pom.gainGig(firstDie, first);
    await pom.expectLastDispatch({ type: "gainGig", dieId: firstDie, as: first });
    await pom.expectFixerDiceCount(first, 5);
    await pom.expectGigCount(first, 1);
    expect(await pom.getPendingChoiceType(first)).toBeNull();

    await pom.expectHandSize(second, 6);
    await pom.expectFixerDiceCount(second, 6);
    await pom.expectGigCount(second, 0);

    await pom.expectBoardMode(first, "select-action");

    await pom.passPhase(first);

    // ── TURN 1 (second player) — START PHASE ─────────────────────────────
    expect(await pom.getActivePlayerId()).toBe(second);
    expect(await pom.getTurnNumber()).toBe(2);
    expect(await pom.getPhase()).toBe("start");
    expect(await getSpentLegendsCount(pom, second)).toBe(0);
    await pom.expectHandSize(second, 7);
    await pom.gainGig(await pom.pickFirstAllowedDie(second), second);
    await pom.expectFixerDiceCount(second, 5);
    await pom.expectGigCount(second, 1);

    await pom.expectBoardMode(second, "select-action");
    await pom.passPhase(second);

    // ── TURN 2 (first player) — START PHASE ──────────────────────────────
    expect(await pom.getActivePlayerId()).toBe(first);
    expect(await pom.getTurnNumber()).toBe(3);
    expect(await pom.getPhase()).toBe("start");
    expect(await getSpentLegendsCount(pom, first)).toBe(0);
    await pom.expectHandSize(first, 8);
    await pom.gainGig(await pom.pickFirstAllowedDie(first), first);
    await pom.expectFixerDiceCount(first, 4);
    await pom.expectGigCount(first, 2);

    await pom.passPhase(first);

    // ── TURN 2 (second player) — START PHASE ─────────────────────────────
    expect(await pom.getActivePlayerId()).toBe(second);
    expect(await pom.getTurnNumber()).toBe(4);
    expect(await pom.getPhase()).toBe("start");
    expect(await getSpentLegendsCount(pom, second)).toBe(0);
    await pom.expectHandSize(second, 8);
    await pom.gainGig(await pom.pickFirstAllowedDie(second), second);
    await pom.expectFixerDiceCount(second, 4);
    await pom.expectGigCount(second, 2);

    await pom.passPhase(second);

    // ── End state — turn 5 about to start (first player) ─────────────────
    expect(await pom.getTurnNumber()).toBe(5);
    expect(await pom.getActivePlayerId()).toBe(first);
    await pom.expectHandSize(first, 9);
    await pom.expectFixerDiceCount(first, 4);
    await pom.expectGigCount(first, 2);
    await pom.expectPendingChoiceType(first, "gainGig");
    await pom.expectHandSize(second, 8);
    await pom.expectFixerDiceCount(second, 4);
    await pom.expectGigCount(second, 2);

    expect(await pom.isGameOver()).toBe(false);
  });
});

async function getSpentLegendsCount(
  pom: Awaited<ReturnType<typeof createPlaywrightCyberpunkSimulatorPom>>,
  player: PlayerId,
): Promise<number> {
  const legends = await pom.getCardsInZone("legendArea", player);
  return legends.filter((card) => card.spent).length;
}
