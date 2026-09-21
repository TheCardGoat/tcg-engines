import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGildedMaton,
  welcomeToNightCityRetailGunpointDiplomacy,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const gunpoint = welcomeToNightCityRetailGunpointDiplomacy;

describe("Gunpoint Diplomacy", () => {
  it("is the exact 4-cost red Ganger/Plan Program with its strict Street Cred modal effect", () => {
    expect(gunpoint).toMatchObject({
      canonicalId: "gunpoint-diplomacy",
      slug: "gunpoint-diplomacy",
      name: "Gunpoint Diplomacy",
      displayName: "Gunpoint Diplomacy",
      type: "program",
      color: "red",
      classifications: ["Ganger", "Plan"],
      cost: 4,
      ram: 3,
      hasSellTag: true,
      timingTriggers: ["play"],
      printNumber: "032",
      rarity: "Uncommon",
      rulesText:
        "Give a friendly Unit these effects. If you have less ☆ (Street Cred) than a Rival, they instead choose one effect for you.\nThe next time this Unit attacks this turn, it may attack ready Units. // Give this Unit +3 power this turn.",
      reminderText: ["Discard programs after they resolve."],
    });
    expect(gunpoint.abilities).toHaveLength(1);
    expect(gunpoint.abilities[0]).toMatchObject({
      trigger: { trigger: "play" },
      bindings: [
        {
          id: "selectedUnit",
          target: {
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: { min: 1, max: 1 },
          },
        },
      ],
      effects: [
        {
          effect: "chooseEffect",
          chooser: "rival",
          options: [
            {
              id: "both",
              conditions: [
                {
                  condition: "not",
                  of: {
                    condition: "streetCredComparison",
                    controller: "friendly",
                    comparison: "lt",
                    other: "rival",
                  },
                },
              ],
              effects: [
                {
                  effect: "grantRule",
                  rule: "canAttackReadyUnits",
                  duration: "turn",
                  uses: 1,
                },
                { effect: "modifyPower", value: 3, duration: "turn" },
              ],
            },
            {
              id: "ready-attack",
              conditions: [
                {
                  condition: "streetCredComparison",
                  controller: "friendly",
                  comparison: "lt",
                  other: "rival",
                },
              ],
              effects: [
                {
                  effect: "grantRule",
                  rule: "canAttackReadyUnits",
                  duration: "turn",
                  uses: 1,
                },
              ],
            },
            {
              id: "plus-power",
              conditions: [
                {
                  condition: "streetCredComparison",
                  controller: "friendly",
                  comparison: "lt",
                  other: "rival",
                },
              ],
              effects: [{ effect: "modifyPower", value: 3, duration: "turn" }],
            },
          ],
        },
      ],
    });
  });

  it("gives a friendly Unit both effects when you do not have less Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gunpoint],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 4,
        gigArea: [{ dieType: "d10", faceValue: 8 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(gunpoint, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      (welcomeToNightCityRetailFieldOperator.power ?? 0) + 3,
    );
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).toContain(
      "canAttackReadyUnits",
    );
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ).success,
    ).toBe(true);
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).not.toContain(
      "canAttackReadyUnits",
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      gunpoint.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("gives both effects at exactly equal Street Cred and removes unused effects at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gunpoint],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
      { gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );
    const unitId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    const basePower = getEffectivePower(engine.getState(), unitId);

    engine.playCard(gunpoint, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(getEffectivePower(engine.getState(), unitId)).toBe(basePower + 3);
    expect(getEffectiveRules(engine.getState(), unitId)).toContain("canAttackReadyUnits");

    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), unitId)).toBe(basePower);
    expect(getEffectiveRules(engine.getState(), unitId)).not.toContain("canAttackReadyUnits");
  });

  it("offers only friendly field Units as the required target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gunpoint],
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailGildedMaton, spent: false, hasLag: false },
        ],
        eddies: 4,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }] },
    );

    engine.playCard(gunpoint, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit target choice.");
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
        engine.findCardId(welcomeToNightCityRetailGildedMaton, "field", P1),
      ]),
    );
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("lets the Rival choose one effect when you have less Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gunpoint],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [{ dieType: "d10", faceValue: 9 }],
      },
    );

    engine.playCard(gunpoint, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "Rival still chooses which Gunpoint Diplomacy effect applies",
    });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseEffect");
    expect(choice?.chooserId).toBe(P2);
    if (choice?.type === "chooseEffect") {
      expect(choice.payload.options.map((option) => option.id).sort()).toEqual([
        "plus-power",
        "ready-attack",
      ]);
    }

    const failure = engine.expectFailure(() =>
      engine.resolveChooseEffect("plus-power", { as: P1 }),
    );
    expect(failure.errorCode).toBe("NOT_YOUR_CHOICE");
    const unitBeforeChoice = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unitBeforeChoice.instanceId as string)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
    expect(
      getEffectiveRules(engine.getState(), unitBeforeChoice.instanceId as string),
    ).not.toContain("canAttackReadyUnits");
    expect(engine.getState().G.turnMetadata.pendingChoice?.chooserId).toBe(P2);

    engine.resolveChooseEffect("plus-power", { as: P2 });
    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      (welcomeToNightCityRetailFieldOperator.power ?? 0) + 3,
    );
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).not.toContain(
      "canAttackReadyUnits",
    );
  });

  it("lets the Rival choose only the one-use ready-Unit attack permission", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gunpoint],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d10", faceValue: 9 }],
      },
    );
    const unitId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    const basePower = getEffectivePower(engine.getState(), unitId);

    engine.playCard(gunpoint, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "Rival chooses the Gunpoint Diplomacy branch",
    });
    engine.resolveChooseEffect("ready-attack", { as: P2 });

    expect(getEffectivePower(engine.getState(), unitId)).toBe(basePower);
    expect(getEffectiveRules(engine.getState(), unitId)).toContain("canAttackReadyUnits");
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ).success,
    ).toBe(true);
    expect(getEffectiveRules(engine.getState(), unitId)).not.toContain("canAttackReadyUnits");
  });

  it("resolves as much as possible with no friendly Unit, paying and discarding the Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [gunpoint], eddies: 4 });

    expect(engine.playCard(gunpoint, { as: P1 })).toMatchObject({ success: true });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      gunpoint.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      gunpoint.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
