import { describe, expect, it } from "vite-plus/test";
import {
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  embracingPowerRetailStarterDeckMinotaur,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Minotaur", () => {
  it("defeats a rival Unit with power 5 or less when friendly Street Cred is higher", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [embracingPowerRetailStarterDeckMinotaur],
        eddies: 7,
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
    );

    engine.playCard(embracingPowerRetailStarterDeckMinotaur, { as: P1 });
    engine.resolveEffectTarget(alphaSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaSwordwiseHuscle.id,
    );
  });

  it("does not trigger when friendly Street Cred is not higher", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [embracingPowerRetailStarterDeckMinotaur],
        eddies: 7,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        field: [{ card: alphaRuthlessLowlife, spent: false }],
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
    );

    engine.playCard(embracingPowerRetailStarterDeckMinotaur, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );
  });
});
