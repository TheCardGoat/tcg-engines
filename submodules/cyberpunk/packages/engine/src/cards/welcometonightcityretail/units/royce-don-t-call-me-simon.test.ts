import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailRoyceDonTCallMeSimon,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Royce - Don't Call Me Simon", () => {
  it("has the exact red Ganger Maelstrom Play identity and replacement thresholds", () => {
    expect(welcomeToNightCityRetailRoyceDonTCallMeSimon).toMatchObject({
      canonicalId: "royce-don-t-call-me-simon",
      slug: "royce-don-t-call-me-simon",
      name: "Royce",
      subname: "Don't Call Me Simon",
      displayName: "Royce: Don't Call Me Simon",
      type: "unit",
      color: "red",
      classifications: ["Ganger", "Maelstrom"],
      cost: 5,
      power: 4,
      ram: 2,
      hasSellTag: false,
      rarity: "Uncommon",
      printNumber: "016",
      timingTriggers: ["play"],
      rulesText:
        "{Play} Defeat a rival Unit with power 2 or less. If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 3 or less instead.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          effects: [
            {
              effect: "defeat",
              target: { controller: "rival", maxPower: 3 },
              conditions: [
                {
                  condition: "streetCredComparison",
                  controller: "friendly",
                  comparison: "gt",
                  other: "rival",
                },
              ],
            },
            {
              effect: "defeat",
              target: { controller: "rival", maxPower: 2 },
              conditions: [
                {
                  condition: "streetCredComparison",
                  controller: "friendly",
                  comparison: "lte",
                  other: "rival",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("defeats a rival unit with power two or less on play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
        legendArea: [],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("pays exactly 5 Eddies, enters with Lag, and resolves when no target exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
      legendArea: [],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    const royce = engine.getCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, "field", P1);
    expect(royce.meta.hasLag).toBe(true);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("uses the inclusive power-3 threshold only with strictly more Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
        legendArea: [],
        eddies: 5,
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, powerModifier: 1 },
          welcomeToNightCityRetailRoyceDonTCallMeSimon,
        ],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
    );
    const powerThree = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    const powerFour = engine.getCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, "field", P2);

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({ type: "chooseTarget" });
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Royce target choice");
    expect(choice.payload.eligibleIds).toContain(powerThree.instanceId);
    expect(choice.payload.eligibleIds).not.toContain(powerFour.instanceId);

    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("uses the power-2 threshold at equal Street Cred and effective power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
        legendArea: [],
        eddies: 5,
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
      {
        field: [
          welcomeToNightCityRetailFieldOperator,
          { card: welcomeToNightCityRetailCorpoSecurity, powerModifier: 1 },
        ],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
    );
    const powerTwo = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    const powerThree = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Royce target choice");
    expect(choice.payload.eligibleIds).toContain(powerTwo.instanceId);
    expect(choice.payload.eligibleIds).not.toContain(powerThree.instanceId);
  });

  it("offers only rival Units and uses their effective rather than printed power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
        legendArea: [],
        field: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 5,
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailRoyceDonTCallMeSimon, powerModifier: -1 }],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
    );
    const friendly = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1);
    const reducedRival = engine.getCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, "field", P2);

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Royce target choice");
    expect(choice.payload.eligibleIds).toEqual([reducedRival.instanceId]);
    expect(choice.payload.eligibleIds).not.toContain(friendly.instanceId);
  });

  it("does not offer a 6-power rival unit as the low-Street-Cred target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [embracingPowerRetailStarterDeckMinotaur],
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBeUndefined();
  });
});
