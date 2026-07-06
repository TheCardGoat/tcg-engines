import { describe, expect, it } from "vite-plus/test";
import {
  alphaGoroTakemuraHandsUnclean,
  alphaRuthlessLowlife,
  alphaVCorporateExile,
  welcomeToNightCityRetailMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectAttachTarget } from "../../../testing/index.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";

describe("Mantis Blades", () => {
  function getAttachTargets(engine: CyberpunkTestEngine): string[] {
    const gearId = engine.getCard(welcomeToNightCityRetailMantisBlades, "hand", P1).instanceId;
    const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") return [];
    return (
      playMove.inputSpec.candidates.find((candidate) => candidate.cardId === gearId)
        ?.attachTargets ?? []
    );
  }

  it("can attach to a friendly Unit or face-up Legend, but not a face-down Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMantisBlades],
      field: [{ card: alphaRuthlessLowlife, spent: false }],
      legendArea: [
        { card: alphaVCorporateExile, faceDown: false },
        { card: alphaGoroTakemuraHandsUnclean, faceDown: true },
      ],
      eddies: 1,
    });

    expectAttachTarget(engine, welcomeToNightCityRetailMantisBlades, alphaRuthlessLowlife);
    const attachTargets = getAttachTargets(engine);
    expect(attachTargets).toContain(
      engine.getCard(alphaVCorporateExile, "legendArea", P1).instanceId,
    );
    expect(attachTargets).not.toContain(
      engine.getCard(alphaGoroTakemuraHandsUnclean, "legendArea", P1).instanceId,
    );
  });

  it("adds its printed power to the attached Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMantisBlades],
      field: [{ card: alphaRuthlessLowlife, spent: false }],
      eddies: 1,
    });

    engine.attachGear(welcomeToNightCityRetailMantisBlades, alphaRuthlessLowlife, { as: P1 });

    const host = engine.getCard(alphaRuthlessLowlife, "field", P1);
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      alphaRuthlessLowlife.power + 2,
    );
  });
});
