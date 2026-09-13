import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailChromeFang,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const fang = welcomeToNightCityRetailChromeFang;

describe("Chrome Fang", () => {
  it("is a red Ganger/Netrunner/Tyger Claws unit", () => {
    expect(fang).toMatchObject({
      type: "unit",
      color: "red",
      cost: 5,
      power: 6,
      printNumber: "008",
    });
  });

  it("on Play grants a steal restriction until its controller's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [fang],
      eddies: 5,
      gigArea: [{ dieType: "d12", faceValue: 12 }],
    });

    engine.playCard(fang, { as: P1 });
    const instance = engine.getCard(fang, "field", P1);
    expect(getEffectiveRules(engine.getState(), instance.instanceId as string)).toContain(
      "cantStealGigAbovePower",
    );
  });

  it("stops a rival Unit from stealing a Gig valued higher than its power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        eddies: 5,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );
    engine.playCard(fang, { as: P1 });

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d12");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).not.toContain("d12");
  });

  it("still allows stealing a Gig whose value is at most the attacker's power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );
    engine.playCard(fang, { as: P1 });

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d4");
  });

  it("keeps its until-next-turn steal restriction after leaving the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        eddies: 5,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );
    engine.playCard(fang, { as: P1 });
    engine.judgeMoveCardToZone(fang, "trash", { as: P1 });

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d12");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).not.toContain("d12");
  });
});
