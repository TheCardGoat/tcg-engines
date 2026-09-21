import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailChromeFang,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGorillaArms,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const fang = welcomeToNightCityRetailChromeFang;

describe("Chrome Fang", () => {
  it("is a 5-cost 6-power red Ganger/Netrunner/Tyger Claws Unit with the printed Play ability", () => {
    expect(fang).toMatchObject({
      type: "unit",
      color: "red",
      classifications: ["Ganger", "Netrunner", "Tyger Claws"],
      cost: 5,
      power: 6,
      ram: 1,
      hasSellTag: false,
      printNumber: "008",
      timingTriggers: ["play"],
    });
    expect(fang.abilities).toEqual([
      expect.objectContaining({
        kind: "triggered",
        text: "{Play} Until your next turn, rival Units can't steal friendly Gigs with value higher than their power.",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [
          {
            effect: "grantRule",
            target: { selector: "self" },
            rule: "cantStealGigAbovePower",
            duration: "untilSourceNextTurn",
          },
        ],
      }),
    ]);
  });

  it("pays 5 €$, enters the field, and grants the restriction on Play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [fang],
      eddies: 5,
      gigArea: [{ dieType: "d12", faceValue: 12 }],
    });

    engine.playCard(fang, { as: P1 });
    const instance = engine.getCard(fang, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(instance.meta.spent).toBe(false);
    expect(getEffectiveRules(engine.getState(), instance.instanceId as string)).toContain(
      "cantStealGigAbovePower",
    );
  });

  it("stops a rival Unit from stealing a Gig valued higher than its power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        eddies: 5,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d12", faceValue: 12 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );
    engine.playCard(fang, { as: P1 });

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.executeMove("resolveAttack", { args: {} }, P2);
    engine.executeMove("resolveAttack", { args: { pass: true } }, P1);
    engine.executeMove("resolveAttack", { args: {} }, P2);

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseGigsToSteal");
    if (!choice || choice.type !== "chooseGigsToSteal") {
      throw new Error("Expected the attacking player to choose a Gig.");
    }
    const highGigId = choice.payload.eligibleDieIds.find(
      (id) => engine.getState().G.gigDice[id]?.faceValue === 12,
    );
    expect(highGigId).toBeDefined();
    expect(choice.payload.eligibleDieIds).toHaveLength(2);
    engine.executeMove("resolveStealGigs", { args: { dieIds: [highGigId!] } }, P2);

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d12");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).not.toContain("d12");
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d4");
  });

  it("still allows stealing a Gig whose value equals the attacker's power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
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

  it("uses the rival Unit's effective power when filtering Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        eddies: 5,
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 7 },
        ],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            powerModifier: 4,
          },
        ],
      },
    );
    engine.playCard(fang, { as: P1 });

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.getGigDice(P2).map((die) => die.faceValue)).toContain(6);
    expect(engine.getGigDice(P1).map((die) => die.faceValue)).toContain(7);
  });

  it("protects only its controller's friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 5,
      },
      {
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
    );
    engine.playCard(fang, { as: P1 });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d12");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).not.toContain("d12");
  });

  it("also filters a rival Unit's card-driven Gig steal", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fang],
        eddies: 5,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 6 },
        ],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailGorillaArms],
          },
        ],
      },
    );
    engine.playCard(fang, { as: P1 });

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected Gorilla Arms to offer its card-driven Gig steal.");
    }
    const highGigId = choice.payload.eligibleIds?.find(
      (id) => engine.getState().G.gigDice[id]?.faceValue === 6,
    );
    expect(highGigId).toBeDefined();
    engine.resolveEffectTargetIds([highGigId!], { as: P2 });

    expect(engine.getGigDice(P2).map((die) => die.faceValue)).toEqual([1]);
    expect(engine.getGigDice(P1).map((die) => die.faceValue)).toEqual([6]);
    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
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

  it("remains active through the Rival's turn and expires at the start of its controller's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [fang],
      eddies: 5,
    });
    engine.playCard(fang, { as: P1 });
    const instance = engine.getCard(fang, "field", P1);

    for (let i = 0; i < 8 && engine.getActivePlayerId() !== P2; i++) {
      engine.passPhase({ as: engine.getActivePlayerId() });
    }
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(getEffectiveRules(engine.getState(), instance.instanceId as string)).toContain(
      "cantStealGigAbovePower",
    );

    for (let i = 0; i < 8 && engine.getActivePlayerId() !== P1; i++) {
      engine.passPhase({ as: engine.getActivePlayerId() });
    }
    expect(engine.getActivePlayerId()).toBe(P1);
    expect(getEffectiveRules(engine.getState(), instance.instanceId as string)).not.toContain(
      "cantStealGigAbovePower",
    );
  });
});
