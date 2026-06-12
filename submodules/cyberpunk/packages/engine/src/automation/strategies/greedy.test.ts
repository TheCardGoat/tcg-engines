import { describe, expect, test } from "vite-plus/test";
import type { ActiveEffect } from "../../types/index.ts";
import { CyberpunkTestEngine, P1, P2, createMockUnit } from "../../testing/index.ts";
import { AIPlayer } from "../ai-player.ts";
import {
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getSafeAutomatedActionStrategyOption,
} from "../strategy-registry.ts";
import { defaultStrategy } from "./greedy.ts";

function runDefaultBot(engine: CyberpunkTestEngine, playerId = P1) {
  const bot = new AIPlayer(engine.getLocalEngine(), playerId, defaultStrategy, {
    rngSeed: "default-combat-safety",
  });
  return bot.step();
}

function addUnitOnlyAttackRule(engine: CyberpunkTestEngine, attackerId: string): void {
  const effect: ActiveEffect = {
    id: `unit-only-${attackerId}`,
    sourceCardId: attackerId as ActiveEffect["sourceCardId"],
    targetCardId: attackerId as ActiveEffect["targetCardId"],
    kind: "grantRule",
    rule: "canAttackOnPlayedTurnAgainstUnits",
    duration: "turn",
    origin: "imperative",
    abilityIndex: 0,
  };
  engine.judgeAddActiveEffect(effect, { as: P1 });
}

function createUnitOnlyFightFixture(attackerPower: number, defenderPower: number) {
  const attacker = createMockUnit({
    id: `default-fight-attacker-${attackerPower}`,
    name: `Attacker ${attackerPower}`,
    power: attackerPower,
  });
  const defender = createMockUnit({
    id: `default-fight-defender-${defenderPower}`,
    name: `Defender ${defenderPower}`,
    power: defenderPower,
  });
  const engine = CyberpunkTestEngine.createWithFixture(
    { field: [{ card: attacker, spent: false, playedThisTurn: true }] },
    { field: [{ card: defender, spent: true }] },
  );

  engine.spendAllLegends();
  const attackerId = engine.findCardId(attacker, "field", P1);
  addUnitOnlyAttackRule(engine, attackerId as string);

  return { attacker, defender, engine };
}

describe("cyberpunk default automated action strategy", () => {
  test("is the safe fallback for missing or unknown strategy ids", () => {
    expect(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID).toBe("default");
    expect(getSafeAutomatedActionStrategyOption().id).toBe("default");
    expect(getSafeAutomatedActionStrategyOption("does-not-exist").id).toBe("default");
    expect(
      AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === "first-legal")?.testOnly,
    ).toBe(true);
  });

  test("does not attack a spent stronger Unit when the attacker would die", () => {
    const { attacker, defender, engine } = createUnitOnlyFightFixture(2, 5);
    engine.spendAllLegends();
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("passPhase");
    expect(engine.getCard(attacker, "field", P1).meta.spent).toBe(false);
    // Beta rules: readying happens at the start of the turn, so P2's defender
    // is readied as soon as P1's passPhase transitions to P2's turn.
    expect(engine.getCard(defender, "field", P2).meta.spent).toBe(false);
  });

  test("does not take a mutual-defeat Unit fight by default", () => {
    const { attacker, defender, engine } = createUnitOnlyFightFixture(4, 4);
    engine.spendAllLegends();
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("passPhase");
    expect(engine.getCard(attacker, "field", P1).meta.spent).toBe(false);
    expect(engine.getCard(defender, "field", P2).zone).toBe("field");
  });

  test("attacks a spent Unit when the attacker survives the fight", () => {
    const { attacker, defender, engine } = createUnitOnlyFightFixture(6, 3);
    engine.spendAllLegends();
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("attackUnit");
    expect(result.decision.args).toMatchObject({
      attackerId: engine.findCardId(attacker, "field", P1),
      defenderId: engine.findCardId(defender, "field", P2),
    });
  });

  test("does not direct-attack into a stronger ready blocker", () => {
    const attacker = createMockUnit({ id: "direct-weak-attacker", power: 2 });
    const blocker = createMockUnit({
      id: "direct-strong-blocker",
      power: 5,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, playedThisTurn: false }] },
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );

    engine.spendAllLegends();
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("passPhase");
    expect(engine.getCard(attacker, "field", P1).meta.spent).toBe(false);
  });

  test("direct-attacks when the attacker can beat every ready blocker", () => {
    const attacker = createMockUnit({ id: "direct-strong-attacker", power: 7 });
    const blocker = createMockUnit({
      id: "direct-weak-blocker",
      power: 4,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, playedThisTurn: false }] },
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );

    engine.spendAllLegends();
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("attackRival");
    expect(result.decision.args).toMatchObject({
      attackerId: engine.findCardId(attacker, "field", P1),
    });
  });

  test("passes the turn instead of direct-attacking when the rival has no gigs", () => {
    const attacker = createMockUnit({ id: "direct-no-gigs-attacker", power: 7 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, playedThisTurn: false }] },
      { field: [], gigArea: [] },
    );

    engine.spendAllLegends();
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("passPhase");
    expect(engine.getCard(attacker, "field", P1).meta.spent).toBe(false);
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getPhase()).toBe("start");
  });

  test("attacks a spent Unit when no rival gigs are left to steal", () => {
    const attacker = createMockUnit({ id: "no-gigs-unit-attacker", power: 6 });
    const defender = createMockUnit({ id: "no-gigs-unit-defender", power: 3 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, playedThisTurn: false }] },
      { field: [{ card: defender, spent: true }], gigArea: [] },
    );

    engine.spendAllLegends();
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("attackUnit");
    expect(result.decision.args).toMatchObject({
      attackerId: engine.findCardId(attacker, "field", P1),
      defenderId: engine.findCardId(defender, "field", P2),
    });
  });

  test("steals the rival's only gig with one Unit, then passes with remaining ready Units", () => {
    const attackerA = createMockUnit({ id: "one-gig-attacker-a", power: 3 });
    const attackerB = createMockUnit({ id: "one-gig-attacker-b", power: 6 });
    const attackerC = createMockUnit({ id: "one-gig-attacker-c", power: 4 });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: attackerA, spent: false, playedThisTurn: false },
          { card: attackerB, spent: false, playedThisTurn: false },
          { card: attackerC, spent: false, playedThisTurn: false },
        ],
      },
      { field: [], gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );

    engine.spendAllLegends();
    const first = runDefaultBot(engine);

    expect(first.kind).toBe("acted");
    if (first.kind !== "acted") return;
    expect(first.decision.move).toBe("attackRival");
    expect(first.decision.args).toMatchObject({
      attackerId: engine.findCardId(attackerB, "field", P1),
    });

    engine.resolveFullSteal({ as: P1 });
    expect(engine.getGigCount(P2)).toBe(0);
    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getAttackState()).toBeNull();

    engine.spendAllLegends();
    const second = runDefaultBot(engine);

    expect(second.kind).toBe("acted");
    if (second.kind !== "acted") return;
    expect(second.decision.move).toBe("passPhase");
    expect(engine.getCardsInZone("field", P1).filter((card) => card.meta.spent)).toHaveLength(1);
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getPhase()).toBe("start");
  });

  test("opponent bot steals the player's only gig with one Unit, then passes", () => {
    const attackerA = createMockUnit({ id: "opponent-one-gig-attacker-a", power: 3 });
    const attackerB = createMockUnit({ id: "opponent-one-gig-attacker-b", power: 6 });
    const attackerC = createMockUnit({ id: "opponent-one-gig-attacker-c", power: 4 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [], gigArea: [{ dieType: "d6", faceValue: 4 }] },
      {
        field: [
          { card: attackerA, spent: false, playedThisTurn: false },
          { card: attackerB, spent: false, playedThisTurn: false },
          { card: attackerC, spent: false, playedThisTurn: false },
        ],
      },
      { activePlayerId: P2 },
    );

    const first = runDefaultBot(engine, P2);

    expect(first.kind).toBe("acted");
    if (first.kind !== "acted") return;
    expect(first.decision.move).toBe("attackRival");
    expect(first.decision.args).toMatchObject({
      attackerId: engine.findCardId(attackerB, "field", P2),
    });

    engine.resolveFullSteal({ as: P2 });
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);
    expect(engine.getAttackState()).toBeNull();

    engine.spendAllLegends(P2);
    const second = runDefaultBot(engine, P2);

    expect(second.kind).toBe("acted");
    if (second.kind !== "acted") return;
    expect(second.decision.move).toBe("passPhase");
    expect(engine.getCardsInZone("field", P2).filter((card) => card.meta.spent)).toHaveLength(1);
    expect(engine.getActivePlayerId()).toBe(P1);
    expect(engine.getPhase()).toBe("start");
  });
});
