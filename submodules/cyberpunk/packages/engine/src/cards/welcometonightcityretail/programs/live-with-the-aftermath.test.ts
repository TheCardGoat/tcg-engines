import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const aftermath = welcomeToNightCityRetailLiveWithTheAftermath;

function getTargetChoice(engine: CyberpunkTestEngine, chooser: string) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error("Expected a choose-target pending choice.");
  }
  expect(choice.chooserId).toBe(chooser);
  expect(choice.payload.type).toBe("effectTarget");

  return choice;
}

describe("Live with the Aftermath", () => {
  it("makes its controller choose one friendly Unit first", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );

    engine.playCard(aftermath, { as: P1 });

    const choice = getTargetChoice(engine, P1);
    expect(choice.payload.eligibleIds).toEqual([
      engine.getCard(welcomeToNightCityRetailMoxInciters, "field", P1).instanceId,
    ]);
  });

  it("then makes the rival choose one of their own Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      {
        field: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailSwordwiseHuscle],
      },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMoxInciters, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });

    const choice = getTargetChoice(engine, P2);
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).instanceId,
        engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P2).instanceId,
      ]),
    );
  });

  it("defeats the Unit selected by each player and trashes the Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [aftermath], eddies: 3, field: [welcomeToNightCityRetailMoxInciters] },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMoxInciters, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([aftermath.id, welcomeToNightCityRetailMoxInciters.id]),
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
