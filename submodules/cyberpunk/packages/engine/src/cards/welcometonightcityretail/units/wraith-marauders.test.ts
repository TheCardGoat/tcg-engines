import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailWraithMarauders,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Wraith Marauders retail printing", () => {
  it("readies another friendly spent unit whose power equals the stolen Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailWraithMarauders, spent: false, playedThisTurn: false },
          { card: alphaSwordwiseHuscle, spent: true, playedThisTurn: false },
          { card: alphaArmoredMinotaur, spent: true, playedThisTurn: false },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailWraithMarauders, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected chooseTarget choice.");
    const eligible = choice.payload.eligibleIds ?? [];
    expect(eligible).toContain(engine.findCardId(alphaSwordwiseHuscle, "field", P1));
    expect(eligible).not.toContain(engine.findCardId(alphaArmoredMinotaur, "field", P1));

    engine.resolveEffectTarget(alphaSwordwiseHuscle, { as: P1 });

    expect(engine.getCard(alphaSwordwiseHuscle, "field", P1).meta.spent).toBe(false);
    expect(engine.getCard(alphaArmoredMinotaur, "field", P1).meta.spent).toBe(true);
  });
});
