import { describe, expect, test } from "vite-plus/test";
import type { ActiveEffect } from "../../types/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockGear,
  createMockLegend,
  createMockUnit,
} from "../../testing/index.ts";
import { AIPlayer } from "../ai-player.ts";
import {
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  buildAutomatedActionStrategyOptions,
  getSafeAutomatedActionStrategyOption,
} from "../strategy-registry.ts";
import { DEFAULT_GREEDY_WEIGHTS } from "./greedy.ts";

function runDefaultBot(engine: CyberpunkTestEngine, playerId = P1) {
  const bot = new AIPlayer(
    engine.getLocalEngine(),
    playerId,
    getSafeAutomatedActionStrategyOption().strategy,
    { rngSeed: "default-combat-safety" },
  );
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

function addMustAttackRule(engine: CyberpunkTestEngine, attackerId: string, playerId = P1): void {
  const effect: ActiveEffect = {
    id: `must-attack-${attackerId}`,
    sourceCardId: attackerId as ActiveEffect["sourceCardId"],
    targetCardId: attackerId as ActiveEffect["targetCardId"],
    kind: "grantRule",
    rule: "mustAttack",
    duration: "turn",
    origin: "imperative",
    abilityIndex: 0,
  };
  engine.judgeAddActiveEffect(effect, { as: playerId });
}

function addStealsOneFewerGigRule(
  engine: CyberpunkTestEngine,
  attackerId: string,
  playerId = P1,
): void {
  const effect: ActiveEffect = {
    id: `steals-one-fewer-${attackerId}`,
    sourceCardId: attackerId as ActiveEffect["sourceCardId"],
    targetCardId: attackerId as ActiveEffect["targetCardId"],
    kind: "grantRule",
    rule: "stealsOneFewerGig",
    duration: "turn",
    origin: "imperative",
    abilityIndex: 0,
  };
  engine.judgeAddActiveEffect(effect, { as: playerId });
}

function addRequiresProgramPlayedThisTurnRule(
  engine: CyberpunkTestEngine,
  attackerId: string,
  playerId = P1,
): void {
  const effect: ActiveEffect = {
    id: `requires-program-${attackerId}`,
    sourceCardId: attackerId as ActiveEffect["sourceCardId"],
    targetCardId: attackerId as ActiveEffect["targetCardId"],
    kind: "grantRule",
    rule: "requiresProgramPlayedThisTurn",
    duration: "turn",
    origin: "imperative",
    abilityIndex: 0,
  };
  engine.judgeAddActiveEffect(effect, { as: playerId });
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
    { field: [{ card: attacker, spent: false, hasLag: true }] },
    { field: [{ card: defender, spent: true }] },
  );

  engine.spendAllLegends();
  const attackerId = engine.findCardId(attacker, "field", P1);
  addUnitOnlyAttackRule(engine, attackerId as string);

  return { attacker, defender, engine };
}

describe("cyberpunk default automated action strategy", () => {
  test("is the safe fallback for missing or unknown strategy ids", () => {
    expect(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID).toBe("tactical");
    expect(getSafeAutomatedActionStrategyOption().id).toBe("tactical");
    expect(getSafeAutomatedActionStrategyOption("default").id).toBe("tactical");
    expect(getSafeAutomatedActionStrategyOption("does-not-exist").id).toBe("tactical");
    expect(
      AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === "first-legal")?.testOnly,
    ).toBe(true);
    expect(
      AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === "tactical")?.testOnly,
    ).not.toBe(true);
  });

  test("reconstructs a promoted trained strategy from its recorded weights", () => {
    const options = buildAutomatedActionStrategyOptions({
      promotedStrategyId: "greedy-trained-test",
      informationPolicy: "public",
      strategyConfig: { greedyWeights: DEFAULT_GREEDY_WEIGHTS },
    });

    const promoted = options.find((option) => option.id === "greedy-trained-test");
    expect(promoted?.strategy.name).toBe("greedy-trained-test");
    expect(promoted?.informationPolicy).toBe("public");
    expect(promoted?.testOnly).not.toBe(true);
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
      { field: [{ card: attacker, spent: false, hasLag: false }] },
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
      { field: [{ card: attacker, spent: false, hasLag: false }] },
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

  test("preserves a zero-power blocker against an early one-gig direct attack", () => {
    const attacker = createMockUnit({ id: "early-direct-attacker", power: 6 });
    const blocker = createMockUnit({
      id: "early-zero-blocker",
      power: 0,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 4 }] },
      { field: [{ card: attacker, spent: false, hasLag: false }], gigArea: [3] },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P1).meta.spent).toBe(false);
  });

  test("uses a sacrificial blocker to protect a near-win gig lead", () => {
    const attacker = createMockUnit({ id: "late-direct-attacker", power: 6 });
    const blocker = createMockUnit({
      id: "late-zero-blocker",
      power: 0,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
          { dieType: "d12", faceValue: 5 },
        ],
      },
      { field: [{ card: attacker, spent: false, hasLag: false }], gigArea: [3] },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
    expect(engine.getCard(blocker, "field", P1).meta.spent).toBe(true);
  });

  test("uses a blocker against a multi-gig direct attack", () => {
    const attacker = createMockUnit({ id: "multi-gig-direct-attacker", power: 10 });
    const blocker = createMockUnit({
      id: "multi-gig-blocker",
      power: 0,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      { field: [{ card: attacker, spent: false, hasLag: false }], gigArea: [3] },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
  });

  test("preserves a sacrificial blocker when steal reduction makes a high-power attack one Gig", () => {
    const attacker = createMockUnit({ id: "reduced-steal-direct-attacker", power: 10 });
    const blocker = createMockUnit({
      id: "reduced-steal-zero-blocker",
      power: 0,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      { field: [{ card: attacker, spent: false, hasLag: false }], gigArea: [3] },
      { activePlayerId: P2 },
    );
    const attackerId = engine.findCardId(attacker, "field", P2);

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    addStealsOneFewerGigRule(engine, attackerId as string, P2);
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P1).meta.spent).toBe(false);
  });

  test("preserves a blocker that can beat a remaining lower-power attacker when one Gig is at stake", () => {
    const highPowerAttacker = createMockUnit({ id: "bait-high-power-attacker", power: 8 });
    const lowPowerAttacker = createMockUnit({ id: "follow-up-low-power-attacker", power: 4 });
    const blocker = createMockUnit({
      id: "preserve-for-low-power-blocker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {
        field: [
          { card: highPowerAttacker, spent: false, hasLag: false },
          { card: lowPowerAttacker, spent: false, hasLag: false },
        ],
        gigArea: [3],
      },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(highPowerAttacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P1).meta.spent).toBe(false);
  });

  test("uses a blocker against a multi-gig attack instead of saving it for a weaker attacker", () => {
    const highPowerAttacker = createMockUnit({ id: "multi-gig-bait-attacker", power: 10 });
    const lowPowerAttacker = createMockUnit({ id: "multi-gig-follow-up-attacker", power: 4 });
    const blocker = createMockUnit({
      id: "block-current-multi-gig-attacker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {
        field: [
          { card: highPowerAttacker, spent: false, hasLag: false },
          { card: lowPowerAttacker, spent: false, hasLag: false },
        ],
        gigArea: [3],
      },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(highPowerAttacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
  });

  test("uses a blocker when the current attack leaves no Gigs for a lower-power follow-up", () => {
    const currentAttacker = createMockUnit({ id: "last-gig-current-attacker", power: 8 });
    const lowPowerFollowUp = createMockUnit({ id: "last-gig-follow-up-attacker", power: 4 });
    const blocker = createMockUnit({
      id: "block-last-gig-current-attacker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          { card: currentAttacker, spent: false, hasLag: false },
          { card: lowPowerFollowUp, spent: false, hasLag: false },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(currentAttacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
  });

  test("uses a blocker instead of saving it for a lower-power unit with Lag", () => {
    const currentAttacker = createMockUnit({ id: "near-win-current-attacker", power: 8 });
    const laggedFollowUp = createMockUnit({ id: "lagged-follow-up-attacker", power: 4 });
    const blocker = createMockUnit({
      id: "ignore-lagged-follow-up-blocker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        field: [
          { card: currentAttacker, spent: false, hasLag: false },
          { card: laggedFollowUp, spent: false, hasLag: true },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(currentAttacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
  });

  test("uses a blocker instead of saving it for a program-gated lower-power unit", () => {
    const currentAttacker = createMockUnit({ id: "program-gate-current-attacker", power: 8 });
    const gatedFollowUp = createMockUnit({ id: "program-gated-follow-up", power: 4 });
    const blocker = createMockUnit({
      id: "ignore-program-gated-follow-up-blocker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        field: [
          { card: currentAttacker, spent: false, hasLag: false },
          { card: gatedFollowUp, spent: false, hasLag: false },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      { activePlayerId: P2 },
    );
    const gatedFollowUpId = engine.findCardId(gatedFollowUp, "field", P2);

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    addRequiresProgramPlayedThisTurnRule(engine, gatedFollowUpId as string, P2);
    engine.attackRival(currentAttacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
  });

  test("preserves a blocker for a program-gated lower-power unit after a Program was played", () => {
    const currentAttacker = createMockUnit({ id: "program-played-current-attacker", power: 8 });
    const gatedFollowUp = createMockUnit({ id: "program-played-follow-up", power: 4 });
    const blocker = createMockUnit({
      id: "preserve-program-played-follow-up-blocker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {
        field: [
          { card: currentAttacker, spent: false, hasLag: false },
          { card: gatedFollowUp, spent: false, hasLag: false },
        ],
        gigArea: [3],
      },
      { activePlayerId: P2 },
    );
    const gatedFollowUpId = engine.findCardId(gatedFollowUp, "field", P2);

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.getState().G.turnMetadata.playedCardTypesThisTurn[P2] = ["program"];
    addRequiresProgramPlayedThisTurnRule(engine, gatedFollowUpId as string, P2);
    engine.attackRival(currentAttacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P1).meta.spent).toBe(false);
  });

  test("preserves a blocker that can beat a remaining lower-power go solo attacker", () => {
    const currentAttacker = createMockUnit({ id: "go-solo-current-attacker", power: 8 });
    const goSoloFollowUp = createMockLegend({
      id: "go-solo-follow-up-attacker",
      power: 4,
      keywords: ["goSolo"],
    });
    const blocker = createMockUnit({
      id: "preserve-go-solo-follow-up-blocker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {
        field: [
          { card: currentAttacker, spent: false, hasLag: false },
          { card: goSoloFollowUp, spent: false, hasLag: false },
        ],
        gigArea: [3],
      },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(currentAttacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P1).meta.spent).toBe(false);
  });

  test("uses a blocker instead of saving it for a non-required lower-power attacker", () => {
    const currentAttacker = createMockUnit({ id: "must-attack-current-attacker", power: 8 });
    const lowPowerFollowUp = createMockUnit({ id: "non-required-low-follow-up", power: 4 });
    const requiredFollowUp = createMockUnit({ id: "required-high-follow-up", power: 8 });
    const blocker = createMockUnit({
      id: "ignore-non-required-follow-up-blocker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: blocker, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        field: [
          { card: currentAttacker, spent: false, hasLag: false },
          { card: lowPowerFollowUp, spent: false, hasLag: false },
          { card: requiredFollowUp, spent: false, hasLag: false },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      { activePlayerId: P2 },
    );
    const requiredFollowUpId = engine.findCardId(requiredFollowUp, "field", P2);

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(currentAttacker, { as: P2 });
    addMustAttackRule(engine, requiredFollowUpId as string, P2);
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
  });

  test("uses a blocker against one-gig direct attacks with attached gig-steal triggers", () => {
    const attacker = createMockUnit({ id: "attached-trigger-attacker", power: 6 });
    const lowPowerAttacker = createMockUnit({ id: "attached-trigger-follow-up", power: 4 });
    const gear = createMockGear({
      id: "attached-gig-steal-gear",
      power: 0,
      abilities: [
        {
          kind: "triggered",
          text: "When this Unit steals a Gig, steal another Gig.",
          trigger: {
            trigger: "event",
            event: {
              event: "gigStolen",
              player: "friendly",
              target: {
                selector: "gig",
                controller: "rival",
              },
              minAmount: 1,
              source: {
                selector: "host",
              },
            },
          },
          source: {
            selector: "host",
          },
          effects: [],
        },
      ],
    });
    const blocker = createMockUnit({
      id: "attached-trigger-blocker",
      power: 0,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 4 }] },
      {
        field: [
          { card: attacker, spent: false, hasLag: false, attachedGears: [gear] },
          { card: lowPowerAttacker, spent: false, hasLag: false },
        ],
        gigArea: [3],
      },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);
    const blockerId = engine.findCardId(blocker, "field", P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
  });

  test("visible attack trigger hints do not force a block after the attack trigger resolved", () => {
    const attacker = createMockUnit({
      id: "trigger-hint-direct-attacker",
      power: 6,
      timingTriggers: ["attack"],
    });
    const blocker = createMockUnit({
      id: "trigger-hint-zero-blocker",
      power: 0,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 4 }] },
      { field: [{ card: attacker, spent: false, hasLag: false }], gigArea: [3] },
      { activePlayerId: P2 },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const result = runDefaultBot(engine, P1);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(engine.getFilteredView(P1).players.p2?.zones.field).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ instanceId: expect.any(String), triggerHints: ["attack"] }),
      ]),
    );
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P1).meta.spent).toBe(false);
  });

  test("trigger hints do not leak from hidden opponent zones", () => {
    const hiddenHandUnit = createMockUnit({
      id: "hidden-hand-trigger-unit",
      timingTriggers: ["attack"],
    });
    const hiddenLegend = createMockLegend({
      id: "hidden-legend-trigger-unit",
      timingTriggers: ["attack"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [hiddenHandUnit], legendArea: [{ card: hiddenLegend, faceDown: true }] },
      { field: [] },
      { activePlayerId: P2 },
    );

    const view = engine.getFilteredView(P2);
    expect(view.players.p1?.zones.hand).toBe(1);
    expect(view.players.p1?.zones.legendArea).toEqual([
      expect.objectContaining({ faceDown: true, triggerHints: [] }),
    ]);
  });

  test("does not use blocker when the current fight is already won", () => {
    const attacker = createMockUnit({ id: "already-won-fight-attacker", power: 2 });
    const defender = createMockUnit({ id: "already-won-fight-defender", power: 5 });
    const blocker = createMockUnit({
      id: "already-won-fight-blocker",
      power: 3,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        field: [
          { card: defender, spent: true },
          { card: blocker, spent: false },
        ],
      },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackUnit(attacker, defender, { as: P1 });
    engine.resolveAttack({ as: P1 });
    const result = runDefaultBot(engine, P2);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P2).meta.spent).toBe(false);
    expect(engine.getAttackState()).toMatchObject({ kind: "fight", step: "fight" });
  });

  test("uses blocker when it improves the defender's losing fight", () => {
    const attacker = createMockUnit({ id: "losing-fight-attacker", power: 6 });
    const defender = createMockUnit({ id: "losing-fight-defender", power: 2 });
    const blocker = createMockUnit({
      id: "losing-fight-blocker",
      power: 6,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        field: [
          { card: defender, spent: true },
          { card: blocker, spent: false },
        ],
      },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackUnit(attacker, defender, { as: P1 });
    engine.resolveAttack({ as: P1 });
    const result = runDefaultBot(engine, P2);
    const blockerId = engine.findCardId(blocker, "field", P2);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
    expect(engine.getCard(blocker, "field", P2).meta.spent).toBe(true);
    expect(engine.getAttackState()).toMatchObject({
      kind: "fight",
      defenderId: blockerId,
      redirectedByBlocker: true,
    });
  });

  test("does not use an equal-value chump just because the fight attacker had an attack trigger", () => {
    const attacker = createMockUnit({
      id: "resolved-trigger-fight-attacker",
      power: 8,
      timingTriggers: ["attack"],
    });
    const defender = createMockUnit({
      id: "resolved-trigger-fight-defender",
      power: 1,
      cost: 1,
    });
    const blocker = createMockUnit({
      id: "resolved-trigger-fight-blocker",
      power: 2,
      cost: 0,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        field: [
          { card: defender, spent: true },
          { card: blocker, spent: false },
        ],
      },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackUnit(attacker, defender, { as: P1 });
    engine.resolveAttack({ as: P1 });
    const result = runDefaultBot(engine, P2);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("resolveAttack");
    expect(result.decision.args).toMatchObject({ pass: true });
    expect(engine.getCard(blocker, "field", P2).meta.spent).toBe(false);
  });

  test("uses a sacrificial blocker to save a stronger defender from a losing fight", () => {
    const attacker = createMockUnit({ id: "save-defender-attacker", power: 6 });
    const defender = createMockUnit({ id: "save-defender-target", power: 5, cost: 5 });
    const blocker = createMockUnit({
      id: "save-defender-blocker",
      power: 1,
      cost: 1,
      keywords: ["blocker"],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        field: [
          { card: defender, spent: true },
          { card: blocker, spent: false },
        ],
      },
    );

    engine.spendAllLegends(P1);
    engine.spendAllLegends(P2);
    engine.attackUnit(attacker, defender, { as: P1 });
    engine.resolveAttack({ as: P1 });
    const result = runDefaultBot(engine, P2);
    const blockerId = engine.findCardId(blocker, "field", P2);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("useBlocker");
    expect(result.decision.args).toMatchObject({ blockerId });
    expect(engine.getAttackState()).toMatchObject({
      kind: "fight",
      defenderId: blockerId,
      redirectedByBlocker: true,
    });
  });

  test("uses the required must-attack Unit instead of the strongest direct attacker", () => {
    const required = createMockUnit({ id: "must-attack-required", power: 2 });
    const stronger = createMockUnit({ id: "must-attack-stronger", power: 8 });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: required, spent: false, hasLag: false },
          { card: stronger, spent: false, hasLag: false },
        ],
      },
      { field: [], gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );

    engine.spendAllLegends();
    const requiredId = engine.findCardId(required, "field", P1);
    addMustAttackRule(engine, requiredId as string);
    const result = runDefaultBot(engine);

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.decision.move).toBe("attackRival");
    expect(result.decision.args).toMatchObject({ attackerId: requiredId });
  });

  test("passes the turn instead of direct-attacking when the rival has no gigs", () => {
    const attacker = createMockUnit({ id: "direct-no-gigs-attacker", power: 7 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
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
      { field: [{ card: attacker, spent: false, hasLag: false }] },
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
          { card: attackerA, spent: false, hasLag: false },
          { card: attackerB, spent: false, hasLag: false },
          { card: attackerC, spent: false, hasLag: false },
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
          { card: attackerA, spent: false, hasLag: false },
          { card: attackerB, spent: false, hasLag: false },
          { card: attackerC, spent: false, hasLag: false },
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
