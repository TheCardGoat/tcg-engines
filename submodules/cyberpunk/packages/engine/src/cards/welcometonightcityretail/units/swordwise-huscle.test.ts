import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Swordwise Huscle (retail)", () => {
  it("ATTACK does not draw when effective power is below 5", () => {
    // Base power 3 → no draw.
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailMoxInciters],
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: false,
          hasLag: false,
        },
      ],
    });

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("ATTACK draws 1 when effective power is at least 5", () => {
    // Base 3 + modifier +2 → effective 5 → draws 1.
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailMoxInciters],
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: false,
          hasLag: false,
          powerModifier: 2,
        },
      ],
    });

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
  });

  it("ATTACK does not draw when effective power is exactly 4 (boundary)", () => {
    // Printed text: "{Attack} If this Unit has power 5+, draw 1."
    // Base 3 + modifier +1 → effective 4 → still below the `gte 5` threshold.
    // Proves the condition is `>=` against effective (post-modifier) power.
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailMoxInciters],
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: false,
          hasLag: false,
          powerModifier: 1,
        },
      ],
    });

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
