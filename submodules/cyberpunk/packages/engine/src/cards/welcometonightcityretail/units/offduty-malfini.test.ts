import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailEmergencyAtlus,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOffdutyMalfini,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const malfini = welcomeToNightCityRetailOffdutyMalfini;

describe("Offduty Malfini", () => {
  it("is the exact yellow 4-cost 5-power Voodoo Boys Ganger", () => {
    expect(malfini).toMatchObject({
      canonicalId: "offduty-malfini",
      slug: "offduty-malfini",
      name: "Offduty Malfini",
      displayName: "Offduty Malfini",
      type: "unit",
      color: "yellow",
      classifications: ["Ganger", "Voodoo Boys"],
      cost: 4,
      power: 5,
      ram: 2,
      hasSellTag: false,
      printNumber: "051",
      rulesText: "{Play} Spend this Unit and a rival Unit.",
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            { effect: "spend", target: { selector: "self" } },
            {
              effect: "spend",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "ready",
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("pays 4, spends itself, and offers only ready rival Units to spend", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [malfini],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false },
        ],
      },
    );

    engine.playCard(malfini, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(malfini, "field", P1).meta.spent).toBe(true);
    expect(engine.getCard(malfini, "field", P1).meta.hasLag).toBe(true);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      payload: { min: 1, max: 1, canDecline: false },
    });
    if (choice?.type !== "chooseTarget") throw new Error("Expected rival Unit choice");
    expect(choice.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    ]);
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
    );

    expect(
      engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 }),
    ).toMatchObject({
      success: true,
    });
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
  });

  it("still spends itself when no ready rival Unit exists, resolving as much as possible", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [malfini],
        eddies: 4,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
      },
    );

    expect(engine.playCard(malfini, { as: P1 })).toMatchObject({
      success: true,
    });

    expect(engine.getCard(malfini, "field", P1).meta.spent).toBe(true);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("uses its printed 5 power to defeat a 4-power Unit in a public fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: malfini, spent: false, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailEmergencyAtlus, spent: true }] },
    );

    engine.attackUnit(malfini, welcomeToNightCityRetailEmergencyAtlus, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCard(malfini, "field", P1)).toBeDefined();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailEmergencyAtlus.id,
    );
  });
});
