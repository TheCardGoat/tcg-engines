import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJapantownJonin,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const jonin = welcomeToNightCityRetailJapantownJonin;

describe("Japantown Jonin", () => {
  it("is the exact 2-cost 0-power red Tyger Claws Unit with a required friendly Play target", () => {
    expect(jonin).toMatchObject({
      canonicalId: "japantown-jonin",
      type: "unit",
      color: "red",
      classifications: ["Tyger Claws"],
      cost: 2,
      power: 0,
      ram: 2,
      hasSellTag: false,
      printNumber: "010",
      timingTriggers: ["play"],
      reminderText: ["Units with power 0 don't steal Gigs."],
    });
    expect(jonin.abilities).toEqual([
      {
        kind: "triggered",
        text: "{Play} Give a friendly Unit +2 power this turn.",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [
          {
            effect: "modifyPower",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              selection: { mode: "choose", min: 1, max: 1 },
            },
            value: 2,
            duration: "turn",
          },
        ],
      },
    ]);
  });

  it("gives a friendly Unit +2 power this turn when played", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailJapantownJonin],
      field: [{ card: welcomeToNightCityRetailFieldOperator, hasLag: false }],
      eddies: 2,
    });
    const target = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);

    engine.playCard(welcomeToNightCityRetailJapantownJonin, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );

    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });

  it("can target itself with the power boost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailJapantownJonin],
      eddies: 2,
    });

    engine.playCard(welcomeToNightCityRetailJapantownJonin, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailJapantownJonin, { as: P1 });

    const jonin = engine.getCard(welcomeToNightCityRetailJapantownJonin, "field", P1);
    expect(getEffectivePower(engine.getState(), jonin.instanceId)).toBe(
      welcomeToNightCityRetailJapantownJonin.power + 2,
    );
  });

  it("offers exactly one friendly field Unit and excludes a rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [jonin],
        field: [{ card: welcomeToNightCityRetailFieldOperator, hasLag: false }],
        eddies: 2,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }] },
    );

    engine.playCard(jonin, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit target choice.");
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(jonin, "field", P1),
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
      ]),
    );
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("steals no Gigs when its effective power is 0", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: jonin, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );

    engine.attackRival(jonin, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);
  });

  it("can power up another Jonin so the 0-power Unit steals a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [jonin],
        field: [{ card: jonin, spent: false, hasLag: false }],
        eddies: 2,
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    const attacker = engine.getCard(jonin, "field", P1);

    engine.playCard(jonin, { as: P1 });
    engine.resolveEffectTargetIds([attacker.instanceId], { as: P1 });
    expect(getEffectivePower(engine.getState(), attacker.instanceId)).toBe(2);

    engine.attackRival(attacker, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getGigCount(P2)).toBe(0);
  });
});
