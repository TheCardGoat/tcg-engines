import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Swordwise Huscle (retail)", () => {
  it("has the exact red Merc identity and effective-power attack condition", () => {
    expect(welcomeToNightCityRetailSwordwiseHuscle).toMatchObject({
      canonicalId: "swordwise-huscle",
      slug: "swordwise-huscle",
      name: "Swordwise Huscle",
      displayName: "Swordwise Huscle",
      type: "unit",
      color: "red",
      classifications: ["Merc"],
      cost: 3,
      power: 3,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "019",
      timingTriggers: ["attack"],
      rulesText: "{Attack} If this Unit has power 5+, draw 1.",
      abilities: [
        {
          kind: "triggered",
          text: "{Attack} If this Unit has power 5+, draw 1.",
          trigger: { trigger: "attack" },
          source: { selector: "self" },
          effects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
              conditions: [
                {
                  condition: "cardStat",
                  target: { selector: "self" },
                  property: "power",
                  comparison: "gte",
                  value: 5,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 3 to play and enters with Lag", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSwordwiseHuscle],
      eddies: 3,
    });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      successEngine.judgeSpendCard(legend, { as: P1 });
    }
    successEngine.playCard(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    expect(successEngine.getEddies(P1)).toBe(0);
    expect(
      successEngine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.hasLag,
    ).toBe(true);

    const failureEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSwordwiseHuscle],
      eddies: 2,
    });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      failureEngine.judgeSpendCard(legend, { as: P1 });
    }
    expect(() =>
      failureEngine.playCard(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 }),
    ).toThrow(/INSUFFICIENT_EDDIES/);
  });

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

  it("qualifies at power 5 but draws nothing when the deck is empty", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: 0,
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: false,
          hasLag: false,
          powerModifier: 2,
        },
      ],
    });

    engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
  });
});
