import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTakeControl,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { createMockUnit } from "../../../testing/card-mocks.ts";

describe("Take Control", () => {
  it("grants stealsOneFewerGig to the attacker and conditionally draws for AI/Drone/Vehicle", () => {
    // Printed text: "[QUICK] A rival Unit steals 1 fewer Gig this turn.
    // If that Unit is an AI, DRONE, or VEHICLE, draw 1."
    const ability = welcomeToNightCityRetailTakeControl.abilities[1]!;
    expect(ability.kind).toBe("triggered");
    expect(ability.trigger).toMatchObject({ trigger: "play" });

    // Effect 1: the attacker steals one fewer Gig this turn.
    expect(ability.effects[0]).toMatchObject({
      effect: "grantRule",
      target: { selector: "attacker" },
      rule: "stealsOneFewerGig",
      duration: "turn",
    });

    // Effect 2: draw 1 only when the attacker is AI/Drone/Vehicle.
    expect(ability.effects[1]).toMatchObject({
      effect: "draw",
      player: "friendly",
      amount: 1,
    });
    expect(ability.effects[1]?.conditions).toEqual([
      {
        condition: "targetExists",
        target: {
          selector: "attacker",
          classifications: ["AI", "Drone", "Vehicle"],
        },
      },
    ]);
  });

  it("reduces stolen gigs by 1 when played as a QUICK reaction (10 power → 1 steal)", () => {
    // Base rule: 10 power → steal 2 (1 + floor(10/10) = 2). With
    // stealsOneFewerGig granted by Take Control, the steal drops to 1.
    const attacker = createMockUnit({
      id: "mock-attacker-10",
      slug: "mock-attacker-10",
      name: "Ten Power Attacker",
      power: 10,
    });
    const filler = createMockUnit({
      id: "mock-filler-p1",
      slug: "mock-filler-p1",
      name: "Filler",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTakeControl],
        field: [filler],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
        eddies: 5,
      },
      {
        field: [{ card: attacker, spent: false, playedThisTurn: false }],
        eddies: 5,
      },
    );

    // Make it P2's turn so P2 can attack.
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 }); // attack → react

    // P1 plays Take Control as a QUICK reaction during the React step.
    expect(engine.playCard(welcomeToNightCityRetailTakeControl, { as: P1 })).toMatchObject({
      success: true,
    });

    engine.resolveAttack({ as: P1, pass: true }); // react → steal
    engine.resolveAttack({
      as: P2,
      gigIdsToSteal: engine
        .getGigDice(P1)
        .slice(0, 1)
        .map((die) => die.id),
    }); // steal resolves

    const resolved = engine.getLastEvent("attackResolved");
    expect(resolved).toMatchObject({ gigsStolen: 1 });
  });

  it("floors at 0 stolen gigs for low-power attackers", () => {
    // Base rule: 5 power → steal 1. With stealsOneFewerGig → max(0, 1-1) = 0.
    const attacker = createMockUnit({
      id: "mock-attacker-5",
      slug: "mock-attacker-5",
      name: "Five Power Attacker",
      power: 5,
    });
    const filler = createMockUnit({
      id: "mock-filler-p1b",
      slug: "mock-filler-p1b",
      name: "Filler",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTakeControl],
        field: [filler],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        eddies: 5,
      },
      {
        field: [{ card: attacker, spent: false, playedThisTurn: false }],
        eddies: 5,
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 }); // attack → react
    engine.playCard(welcomeToNightCityRetailTakeControl, { as: P1 });
    engine.resolveAttack({ as: P1, pass: true }); // react → steal
    engine.resolveAttack({ as: P2, gigIdsToSteal: [] }); // steal resolves

    const resolved = engine.getLastEvent("attackResolved");
    expect(resolved).toMatchObject({ gigsStolen: 0 });
    // P1 should still have their gig.
    expect(engine.getGigCount(P1)).toBe(1);
  });

  it("draws 1 when the attacker is an AI", () => {
    const attacker = createMockUnit({
      id: "mock-ai-attacker",
      slug: "mock-ai-attacker",
      name: "AI Attacker",
      power: 10,
      classifications: ["AI"],
    });
    const filler = createMockUnit({
      id: "mock-filler-p1c",
      slug: "mock-filler-p1c",
      name: "Filler",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTakeControl],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [filler],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
        eddies: 5,
      },
      {
        field: [{ card: attacker, spent: false, playedThisTurn: false }],
        eddies: 5,
      },
    );

    const handBefore = engine.getHandCount(P1);

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 }); // attack → react
    engine.playCard(welcomeToNightCityRetailTakeControl, { as: P1 });

    // Take Control was played (left hand) AND drew 1 (AI attacker).
    expect(engine.getHandCount(P1)).toBe(handBefore); // -1 played +1 drawn = net 0
  });

  it("does not draw when the attacker is not AI/Drone/Vehicle", () => {
    const attacker = createMockUnit({
      id: "mock-mere-attacker",
      slug: "mock-mere-attacker",
      name: "Mere Attacker",
      power: 10,
      classifications: ["Ganger"],
    });
    const filler = createMockUnit({
      id: "mock-filler-p1d",
      slug: "mock-filler-p1d",
      name: "Filler",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTakeControl],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [filler],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
        eddies: 5,
      },
      {
        field: [{ card: attacker, spent: false, playedThisTurn: false }],
        eddies: 5,
      },
    );

    const handBefore = engine.getHandCount(P1);

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 }); // attack → react
    engine.playCard(welcomeToNightCityRetailTakeControl, { as: P1 });

    // Take Control was played (-1 from hand) with no draw (not AI/Drone/Vehicle).
    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
  });

  it("expires at end of turn", () => {
    const attacker = createMockUnit({
      id: "mock-attacker-expire",
      slug: "mock-attacker-expire",
      name: "Expire Attacker",
      power: 10,
    });
    const filler = createMockUnit({
      id: "mock-filler-p1e",
      slug: "mock-filler-p1e",
      name: "Filler",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTakeControl],
        field: [filler],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
        eddies: 5,
      },
      {
        field: [{ card: attacker, spent: false, playedThisTurn: false }],
        eddies: 5,
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 }); // attack → react
    engine.playCard(welcomeToNightCityRetailTakeControl, { as: P1 });
    engine.resolveAttack({ as: P1, pass: true }); // react → steal
    engine.resolveAttack({
      as: P2,
      gigIdsToSteal: engine
        .getGigDice(P1)
        .slice(0, 1)
        .map((die) => die.id),
    }); // steal resolves

    // The stealsOneFewerGig active effect had duration: "turn" — ending the
    // turn must clear it so a later attack by the same Unit steals normally.
    const attackerId = engine.getCard(attacker, "field", P2).instanceId as string;
    const rulesBefore = engine
      .getState()
      .G.activeEffects.filter(
        (e) =>
          (e.targetCardId as string) === attackerId &&
          e.kind === "grantRule" &&
          e.rule === "stealsOneFewerGig",
      );
    expect(rulesBefore).toHaveLength(1);

    engine.completeTurn({ as: P2 });

    const rulesAfter = engine
      .getState()
      .G.activeEffects.filter(
        (e) =>
          (e.targetCardId as string) === attackerId &&
          e.kind === "grantRule" &&
          e.rule === "stealsOneFewerGig",
      );
    expect(rulesAfter).toHaveLength(0);
  });
});
