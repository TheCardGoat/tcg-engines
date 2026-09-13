import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdrenalineConverter,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const converter = welcomeToNightCityRetailAdrenalineConverter;

describe("Adrenaline Converter", () => {
  it("is a yellow Cyberware/Medtech gear", () => {
    expect(converter).toMatchObject({
      type: "gear",
      color: "yellow",
      classifications: ["Cyberware", "Medtech"],
      cost: 2,
      power: 3,
      printNumber: "059",
    });
  });

  it("gives the host Adrenaline when a Rival has at least 2 more Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator, converter],
        eddies: 10,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.attachGear(converter, welcomeToNightCityRetailFieldOperator, { as: P1 });

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectiveRules(engine.getState(), host.instanceId as string)).toContain("adrenaline");
    expect(engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 }).success).toBe(
      true,
    );
  });

  it("does not grant Adrenaline when the Gig gap is smaller than 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            hasLag: true,
            attachedGears: [converter],
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
    );

    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectiveRules(engine.getState(), host.instanceId as string)).not.toContain(
      "adrenaline",
    );
  });
});
