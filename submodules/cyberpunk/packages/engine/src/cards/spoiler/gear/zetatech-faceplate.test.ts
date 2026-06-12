import { describe, expect, it } from "vite-plus/test";
import { alphaSwordwiseHuscle, spoilerZetatechFaceplate } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Zetatech Faceplate", () => {
  it("attaches to a friendly unit and is the source for spend-triggered Gig adjustment", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [spoilerZetatechFaceplate],
      field: [{ card: alphaSwordwiseHuscle, spent: false }],
      eddies: 2,
      gigArea: [
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 3 },
        { dieType: "d8", faceValue: 5 },
      ],
    });

    engine.attachGear(spoilerZetatechFaceplate, alphaSwordwiseHuscle, { as: P1 });
    engine.judgeSpendCard(alphaSwordwiseHuscle, { as: P1 });

    expect(engine.getCard(alphaSwordwiseHuscle, "field", P1).meta.attachedGearIds).toHaveLength(1);
  });

  it("draws only behind the three-different-Gig-values condition", () => {
    const ability = spoilerZetatechFaceplate.abilities[0]!;
    expect(ability.trigger).toMatchObject({ trigger: "event", event: { event: "cardSpent" } });
    expect(ability.effects.map((effect) => effect.effect)).toEqual(["adjustGig", "draw"]);
    expect(ability.effects[1]).toMatchObject({ effect: "draw", amount: 1 });
  });
});
