import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRebootOptics,
  welcomeToNightCityRetailOverwatchPanamSGift,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Overwatch - Panam's Gift", () => {
  it("discards a card and defeats a spent rival Unit within that cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaRebootOptics],
        field: [welcomeToNightCityRetailOverwatchPanamSGift],
        eddies: 1,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.activateAbility(welcomeToNightCityRetailOverwatchPanamSGift, 1, { as: P1 });
    if (engine.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget") {
      engine.resolveEffectTarget(alphaCorpoSecurity, { as: P1 });
    }

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaRebootOptics.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });
});
