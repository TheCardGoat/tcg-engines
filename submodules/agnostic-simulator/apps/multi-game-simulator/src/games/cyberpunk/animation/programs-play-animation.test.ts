import { describe, expect, it } from "vite-plus/test";
import { programCards } from "@tcg/cyberpunk-cards";
import type { MatchState } from "@tcg/cyberpunk-engine";

import { CyberpunkTestEngine, P1, P2, c } from "../engine/fixtures/scenarios/shared";
import { cyberpunkAnimationScriptToAnimationPlans } from "./sharedEvents";

/**
 * Every program in the catalog must produce its own physical motion on play
 * (the hand → trash settle, plus any reveal steps its effect stages), and the
 * full script must project into a valid V2 plan for both seats. This is the
 * catalog-wide gate behind the per-program fixture benches.
 */
function playProgram(program: { id: string }): {
  engine: CyberpunkTestEngine;
  instanceId: string;
  script: ReturnType<CyberpunkTestEngine["playCard"]>["animationScript"];
} {
  const engine = CyberpunkTestEngine.createWithFixture(
    {
      hand: [program],
      field: [
        { card: c.welcomeToNightCityRetailJackedInVoodooBoy, spent: false, hasLag: false },
        { card: c.welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
      ],
      legendArea: [
        { card: c.welcomeToNightCityRetailVStreetkid, faceDown: false },
        { card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, faceDown: true },
      ],
      gigArea: [
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 4 },
      ],
      eddies: 30,
    },
    {
      field: [
        {
          card: c.welcomeToNightCityRetailCorpoSecurity,
          spent: false,
          hasLag: false,
          powerModifier: 10,
        },
        { card: c.welcomeToNightCityRetailSecondhandBombus, spent: false, hasLag: false },
        { card: c.welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false },
      ],
      legendArea: [{ card: c.welcomeToNightCityRetailPanamPalmerNomadCavalry, faceDown: false }],
      eddies: 30,
    },
    { preserveDeckOrder: true, autoGainGig: false },
  );

  const instanceId = engine.getCardsInZone("hand", P1)[0]?.instanceId;
  if (!instanceId) throw new Error(`${program.id}: hand fixture is empty`);
  const play = engine.playCard(program, { as: P1 });
  return { engine, instanceId: String(instanceId), script: play.animationScript };
}

function planFor(
  script: ReturnType<CyberpunkTestEngine["playCard"]>["animationScript"],
  viewerSeatId: string,
  slug: string,
  state: MatchState,
) {
  const plans = cyberpunkAnimationScriptToAnimationPlans(script, {
    viewerSeatId,
    idPrefix: `program-sweep:${slug}:${viewerSeatId}`,
    state,
  });
  expect(plans.length).toBeGreaterThan(0);
  return plans[0]!;
}

describe("program play animation catalog sweep", () => {
  it("covers every program definition in the catalog", () => {
    expect(programCards.length).toBeGreaterThan(20);
    const ids = new Set(programCards.map((program) => program.id));
    expect(ids.size).toBe(programCards.length);
  });

  for (const program of programCards) {
    it(`${program.slug}: play animates the card and projects a valid plan`, () => {
      const { engine, instanceId, script } = playProgram(program);

      const ownMotion = script.steps.filter(
        (step) =>
          (step.kind === "cardMove" || step.kind === "cardReveal" || step.kind === "cardExit") &&
          "cardId" in step &&
          step.cardId === instanceId,
      );
      expect(ownMotion.length).toBeGreaterThan(0);
      expect(
        ownMotion.some(
          (step) => step.kind === "cardMove" && step.fromZone === "hand" && step.toZone === "trash",
        ),
      ).toBe(true);
      for (const step of script.steps) {
        expect(step.startMs).toBeGreaterThanOrEqual(0);
        expect(step.durationMs).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(step.startMs + step.durationMs)).toBe(true);
      }

      for (const viewerSeatId of [P1, P2]) {
        const plan = planFor(script, viewerSeatId, program.slug, engine.getState());
        expect(plan.steps.length).toBeGreaterThan(0);
        const ownTransfer = plan.steps.find(
          (step) => step.type === "entityTransfer" && step.entity.id === instanceId,
        );
        expect(ownTransfer).toBeDefined();
      }
    });
  }
});
