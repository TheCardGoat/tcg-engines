import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

function startP1TurnAndGainOnlyFixerDie(engine: CyberpunkTestEngine, rngState: number): void {
  engine.completeTurn({ as: P2 });
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("gainGig");
  if (!choice || choice.type !== "gainGig") {
    throw new Error("Expected P1 to choose a Gig at turn start.");
  }
  engine.getState().ctx.rngState = { state: rngState };
  engine.gainGig(choice.payload.allowedDieIds[0]!, { as: P1 });
}

function resolveKerryRollTriggersByDecliningReroll(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTrigger");
  if (!choice || choice.type !== "chooseTrigger") {
    throw new Error("Expected Kerry's roll triggers to be pending.");
  }
  const rerollTrigger = choice.payload.options[0];
  if (!rerollTrigger) throw new Error("Expected Kerry's reroll trigger option.");
  engine.executeMove("resolveTrigger", { args: { triggerId: rerollTrigger.triggerId } }, P1);

  engine.resolveEffectTargetIds([], { as: P1 });
}

describe("Kerry Eurodyne - Axe, Attitude, Audience", () => {
  it("draws 1 after rolling a max non-d20 Gig and declining the optional reroll", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        legendArea: [
          { card: welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
        ],
        fixerDice: ["d4"],
      },
      { deck: [welcomeToNightCityRetailFieldOperator] },
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    startP1TurnAndGainOnlyFixerDie(engine, 1);
    resolveKerryRollTriggersByDecliningReroll(engine);

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(4);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("draws 3 instead after rolling a max d20 Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailSwordwiseHuscle,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
        ],
        fixerDice: ["d20"],
      },
      { deck: [welcomeToNightCityRetailFieldOperator] },
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    startP1TurnAndGainOnlyFixerDie(engine, 21);
    resolveKerryRollTriggersByDecliningReroll(engine);

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d20")?.faceValue).toBe(20);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
      welcomeToNightCityRetailFieldOperator.id,
      welcomeToNightCityRetailSwordwiseHuscle.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
