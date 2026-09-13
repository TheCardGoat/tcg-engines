import { describe, expect, it } from "vite-plus/test";

import { combatAwareStrategy, type CandidateStrategy } from "@tcg/gundam-engine";
import type { PlayerId } from "../../../packages/engine/src/types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockCommand,
  createMockUnit,
} from "../../../packages/engine/src/gundam/testing/index.ts";
import { enumerateGundamBotCandidates } from "../../../packages/engine/src/automation/candidate-enumerator.ts";

import {
  iter14EffectiveCombat,
  iter15SelectiveBlock,
  iter17LastShieldDefense,
  iter20CommandImpact,
  iter22SelectiveCommand,
  iter23CommandVsPilot,
  iter24TempoAwareCommand,
  iter25ThreatAwareTarget,
  iter26BlockerBaitOrder,
  iter27DirectAssault,
  iter28DirectAssaultBait,
  iter29BaseAssault,
  iter30PressureWindow,
  iter31Turn8Pressure,
  iter32Turn10Pressure,
  iter33BlockTax,
  iter34BlockerReserve,
  iter35RaceClock,
  iter36TurnPlan,
  iter37RegretMix,
  deterministicPolicyRoll,
  evaluateAttackPlans,
} from "./experiments.ts";

function context(
  engine: GundamTestEngine,
  candidates = enumerateGundamBotCandidates(
    engine.runtime.getState(),
    PLAYER_ONE as PlayerId,
    engine.runtime.getStaticResources(),
  ),
) {
  return {
    playerId: PLAYER_ONE as PlayerId,
    state: engine.runtime.getState(),
    view: engine.runtime.getFilteredView({
      role: "player" as const,
      playerId: PLAYER_ONE as PlayerId,
    }),
    candidates,
    turnNumber: 0,
    pendingChoice: null,
    cards: engine.runtime.getCardReadAPI(),
  };
}

function firstAttack(engine: GundamTestEngine, strategy: CandidateStrategy, turnNumber = 0) {
  return strategy
    .selectCandidates({ ...context(engine), turnNumber })
    .find((candidate) => candidate.family === "enterBattle");
}

function instanceId(engine: GundamTestEngine, player: string, name: string): string {
  const view = engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId });
  const card = view.zones.zones[`battleArea:${player}`]?.cards.find(
    (candidate) => candidate.definition?.name === name,
  );
  if (!card) throw new Error(`Missing ${name}`);
  return card.instanceId;
}

function zoneInstanceId(
  engine: GundamTestEngine,
  zone: string,
  player: string,
  name: string,
): string {
  const view = engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId });
  const card = view.zones.zones[`${zone}:${player}`]?.cards.find(
    (candidate) => candidate.definition?.name === name,
  );
  if (!card) throw new Error(`Missing ${name} in ${zone}`);
  return card.instanceId;
}

function blockCandidates(engine: GundamTestEngine, blockerIds: readonly string[]) {
  const candidates = blockerIds.map((blockerId) => ({
    family: "declareBlock" as const,
    blockerId,
  }));
  return context(engine, candidates);
}

describe("selective-combat experiments: attack ranking", () => {
  it("uses effective AP from continuous effects instead of printed AP", () => {
    const boosted = createMockUnit({ name: "Boosted", cost: 1, ap: 1, hp: 3 });
    const printedHeavy = createMockUnit({ name: "Printed Heavy", cost: 2, ap: 3, hp: 3 });
    const target = createMockUnit({ name: "Target", cost: 4, ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [boosted, printedHeavy] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );
    const boostedId = instanceId(engine, PLAYER_ONE, "Boosted");
    engine.getG().continuousEffects.push({
      id: "boosted-ap",
      sourceId: boostedId,
      targetId: boostedId,
      payload: { kind: "stat-modifier", stat: "ap", modifier: 4 },
      duration: "this-turn",
      createdAtTurn: 1,
    });

    expect(firstAttack(engine, iter14EffectiveCombat)).toMatchObject({
      family: "enterBattle",
      attackerId: boostedId,
      target: instanceId(engine, PLAYER_TWO, "Target"),
    });
  });

  it("avoids an unfavorable Unit sacrifice when direct pressure is legal", () => {
    const attacker = createMockUnit({ name: "Small Attacker", cost: 4, ap: 2, hp: 2 });
    const target = createMockUnit({ name: "Large Target", cost: 1, ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }], shieldArea: [createMockUnit()] },
    );

    expect(firstAttack(engine, iter14EffectiveCombat)).toMatchObject({
      family: "enterBattle",
      target: "direct",
    });
  });

  it("uses the higher-AP attacker against a Base before Shields", () => {
    const light = createMockUnit({ name: "Light", cost: 1, ap: 1, hp: 2 });
    const heavy = createMockUnit({ name: "Heavy", cost: 3, ap: 5, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [light, heavy] },
      { baseSection: [createMockBase({ hp: 5 })], shieldArea: [createMockUnit()] },
    );

    expect(firstAttack(engine, iter14EffectiveCombat)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Heavy"),
      target: "direct",
    });
  });

  it("accounts for First Strike preventing a lethal retaliation", () => {
    const firstStriker = createMockUnit({
      name: "First Striker",
      cost: 3,
      ap: 4,
      hp: 2,
      keywordEffects: [{ keyword: "FirstStrike" }],
    });
    const target = createMockUnit({ name: "Dangerous Target", cost: 5, ap: 5, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [firstStriker] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter14EffectiveCombat)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Dangerous Target"),
    });
  });

  it("removes a credible next-turn attacker before non-lethal direct pressure", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 2, ap: 7, hp: 7 });
    const threat = createMockUnit({ name: "Threat", cost: 1, ap: 7, hp: 7 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: threat, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter25ThreatAwareTarget)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Attacker"),
      target: instanceId(engine, PLAYER_TWO, "Threat"),
    });
  });

  it("leads with the cheaper direct attacker into an active Blocker", () => {
    const cheap = createMockUnit({ name: "Cheap", cost: 1, ap: 2, hp: 2 });
    const expensive = createMockUnit({ name: "Expensive", cost: 5, ap: 6, hp: 6 });
    const blocker = createMockUnit({
      name: "Blocker",
      cost: 2,
      ap: 1,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [cheap, expensive] },
      { play: [blocker], shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()] },
    );

    expect(firstAttack(engine, iter26BlockerBaitOrder)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Cheap"),
      target: "direct",
    });
  });

  it("applies direct pressure while a favorable enemy Unit target remains", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 5, hp: 5 });
    const target = createMockUnit({ name: "Rested Target", cost: 5, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, combatAwareStrategy)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
    expect(firstAttack(engine, iter27DirectAssault)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Attacker"),
      target: "direct",
    });
  });

  it("combines direct pressure with a cheap Blocker-bait attacker", () => {
    const cheap = createMockUnit({ name: "Cheap", cost: 1, ap: 2, hp: 2 });
    const expensive = createMockUnit({ name: "Expensive", cost: 5, ap: 6, hp: 6 });
    const restedTarget = createMockUnit({ name: "Rested Target", cost: 6, ap: 1, hp: 4 });
    const blocker = createMockUnit({
      name: "Blocker",
      cost: 2,
      ap: 1,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [cheap, expensive] },
      {
        play: [blocker, { card: restedTarget, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter28DirectAssaultBait)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Cheap"),
      target: "direct",
    });
  });

  it("pressures an opposing Base before taking a favorable Unit combat", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 4, hp: 5 });
    const target = createMockUnit({ name: "Rested Target", cost: 6, ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }],
        baseSection: [createMockBase({ hp: 8 })],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter29BaseAssault)).toMatchObject({
      family: "enterBattle",
      target: "direct",
    });
  });

  it("returns to canonical Unit targeting after the Base is destroyed", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 4, hp: 5 });
    const target = createMockUnit({ name: "Rested Target", cost: 6, ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter29BaseAssault)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
  });

  it("pressures Shields from board parity when two attacks survive Blockers", () => {
    const light = createMockUnit({ name: "Light", cost: 1, ap: 2, hp: 2 });
    const heavy = createMockUnit({ name: "Heavy", cost: 4, ap: 6, hp: 6 });
    const target = createMockUnit({ name: "Rested Target", cost: 5, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [light, heavy] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter30PressureWindow)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Light"),
      target: "direct",
    });
  });

  it("keeps Unit control when only one direct attack can connect", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 5, hp: 5 });
    const target = createMockUnit({ name: "Rested Target", cost: 5, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter30PressureWindow)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
  });

  it("does not open a Base when no follow-up can get past the active Blocker", () => {
    const breaker = createMockUnit({ name: "Breaker", cost: 3, ap: 5, hp: 5 });
    const followUp = createMockUnit({ name: "Follow Up", cost: 2, ap: 3, hp: 3 });
    const target = createMockUnit({ name: "Rested Target", cost: 20, ap: 1, hp: 4 });
    const blocker = createMockUnit({
      name: "Blocker",
      cost: 2,
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [breaker, followUp] },
      {
        play: [blocker, { card: target, exhausted: true }],
        baseSection: [createMockBase({ hp: 4 })],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter30PressureWindow)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
  });

  it("breaks a Base with the smallest sufficient attacker before the Shield follow-up", () => {
    const exactBreaker = createMockUnit({ name: "Exact Breaker", cost: 2, ap: 4, hp: 4 });
    const heavy = createMockUnit({ name: "Heavy", cost: 5, ap: 7, hp: 7 });
    const target = createMockUnit({ name: "Rested Target", cost: 5, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [exactBreaker, heavy] },
      {
        play: [{ card: target, exhausted: true }],
        baseSection: [createMockBase({ hp: 4 })],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter30PressureWindow)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Exact Breaker"),
      target: "direct",
    });
  });

  it("keeps canonical Unit control before the late-pressure clock", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 5, hp: 5 });
    const target = createMockUnit({ name: "Rested Target", cost: 5, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter31Turn8Pressure, 7)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
  });

  it("switches to direct pressure when the configured turn clock expires", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 5, hp: 5 });
    const target = createMockUnit({ name: "Rested Target", cost: 5, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter31Turn8Pressure, 8)).toMatchObject({
      family: "enterBattle",
      target: "direct",
    });
    expect(firstAttack(engine, iter32Turn10Pressure, 9)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
    expect(firstAttack(engine, iter32Turn10Pressure, 10)).toMatchObject({
      family: "enterBattle",
      target: "direct",
    });
  });

  it("leads with the least valuable direct attacker predicted to consume a Blocker", () => {
    const bait = createMockUnit({ name: "Bait", cost: 3, ap: 5, hp: 2 });
    const heavy = createMockUnit({ name: "Heavy", cost: 6, ap: 7, hp: 7 });
    const target = createMockUnit({ name: "Rested Target", cost: 20, ap: 1, hp: 4 });
    const blocker = createMockUnit({
      name: "Blocker",
      cost: 2,
      ap: 3,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [bait, heavy] },
      {
        play: [blocker, { card: target, exhausted: true }],
        baseSection: [createMockBase({ hp: 5 })],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, combatAwareStrategy)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
    expect(firstAttack(engine, iter33BlockTax)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Bait"),
      target: "direct",
    });
  });

  it("does not bait a Blocker that the defensive model should preserve", () => {
    const light = createMockUnit({ name: "Light", cost: 1, ap: 1, hp: 1 });
    const heavy = createMockUnit({ name: "Heavy", cost: 6, ap: 7, hp: 7 });
    const target = createMockUnit({ name: "Rested Target", cost: 20, ap: 1, hp: 4 });
    const blocker = createMockUnit({
      name: "Valuable Blocker",
      cost: 8,
      ap: 0,
      hp: 1,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [light, heavy] },
      {
        play: [blocker, { card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter33BlockTax)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Target"),
    });
  });

  it("takes the direct line when its visible race clock is faster", () => {
    const probe = createMockUnit({ name: "Probe", cost: 1, ap: 2, hp: 2 });
    const closer = createMockUnit({ name: "Closer", cost: 4, ap: 6, hp: 6 });
    const target = createMockUnit({ name: "Rested Target", cost: 6, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [probe, closer],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
      },
      { play: [{ card: target, exhausted: true }], shieldArea: [createMockUnit()] },
    );

    expect(firstAttack(engine, iter35RaceClock)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Probe"),
      target: "direct",
    });
  });

  it("keeps Unit control when the opponent owns the faster visible race", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 4, ap: 6, hp: 6 });
    const target = createMockUnit({ name: "Rested Threat", cost: 7, ap: 1, hp: 5 });
    const extraThreat = createMockUnit({ name: "Extra Threat", cost: 4, ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }, extraThreat],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter35RaceClock)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Rested Threat"),
    });
  });

  it("assumes a visible Blocker absorbs the highest-AP blockable attacker", () => {
    const heavy = createMockUnit({ name: "Clock Heavy", cost: 5, ap: 6, hp: 6 });
    const light = createMockUnit({ name: "Clock Light", cost: 1, ap: 1, hp: 2 });
    const target = createMockUnit({ name: "Clock Target", cost: 8, ap: 1, hp: 5 });
    const blocker = createMockUnit({
      name: "Clock Blocker",
      cost: 2,
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [heavy, light] },
      {
        play: [blocker, { card: target, exhausted: true }],
        baseSection: [createMockBase({ hp: 6 })],
      },
    );

    const parent = context(engine);
    const attacks = combatAwareStrategy
      .selectCandidates(parent)
      .filter((candidate) => candidate.family === "enterBattle");
    expect(evaluateAttackPlans(parent, attacks)).toMatchObject({
      ownTurnsToDefeat: 7,
      opponentTurnsToDefeat: 1,
    });
  });

  it("selects the pressure plan when it converts the whole attack step into lethal", () => {
    const probe = createMockUnit({ name: "Plan Probe", cost: 1, ap: 2, hp: 2 });
    const closer = createMockUnit({ name: "Plan Closer", cost: 4, ap: 6, hp: 6 });
    const target = createMockUnit({ name: "Plan Target", cost: 6, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [probe, closer], shieldArea: [createMockUnit(), createMockUnit()] },
      { play: [{ card: target, exhausted: true }], shieldArea: [createMockUnit()] },
    );

    expect(firstAttack(engine, iter36TurnPlan)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Plan Probe"),
      target: "direct",
    });
  });

  it("selects the control plan when pressure is slow and a valuable kill is available", () => {
    const attacker = createMockUnit({ name: "Control Attacker", cost: 4, ap: 7, hp: 7 });
    const target = createMockUnit({ name: "Control Target", cost: 8, ap: 1, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: target, exhausted: true }],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()],
      },
    );

    expect(firstAttack(engine, iter36TurnPlan)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Control Target"),
    });
  });

  it("keeps regret-bounded variation deterministic and inside legal candidates", () => {
    const attacker = createMockUnit({ name: "Mixed Attacker", cost: 3, ap: 4, hp: 4 });
    const target = createMockUnit({ name: "Mixed Target", cost: 3, ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }], shieldArea: [createMockUnit()] },
    );
    const parent = context(engine);
    const first = iter37RegretMix.selectCandidates(parent);
    const second = iter37RegretMix.selectCandidates(parent);

    expect(second).toEqual(first);
    expect(first.every((candidate) => parent.candidates.includes(candidate))).toBe(true);
    const rolls = Array.from({ length: 32 }, (_, index) =>
      deterministicPolicyRoll(`state-${index}`),
    );
    expect(rolls.some((roll) => roll < 0.5)).toBe(true);
    expect(rolls.some((roll) => roll >= 0.5)).toBe(true);
  });
});

describe("selective-combat experiments: Blocker sequencing", () => {
  it("reserves one Blocker for a larger Base-breaking attacker later this turn", () => {
    const blocker = createMockUnit({
      name: "Blocker",
      cost: 2,
      ap: 3,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const probe = createMockUnit({ name: "Probe", cost: 1, ap: 2, hp: 5 });
    const breaker = createMockUnit({ name: "Breaker", cost: 5, ap: 5, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [blocker], baseSection: [createMockBase({ hp: 5 })] },
      { play: [probe, breaker] },
    );
    const blockerId = instanceId(engine, PLAYER_ONE, "Blocker");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "Probe"),
      attackerPlayerId: PLAYER_TWO,
      target: "direct",
    };
    const candidates = [{ family: "declareBlock" as const, blockerId }];

    expect(combatAwareStrategy.selectCandidates(context(engine, candidates))).toEqual([
      { family: "declareBlock", blockerId },
    ]);
    expect(iter34BlockerReserve.selectCandidates(context(engine, candidates))).toEqual([]);
  });

  it("still blocks immediately when no stronger attacker remains", () => {
    const blocker = createMockUnit({
      name: "Blocker",
      cost: 2,
      ap: 3,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({ name: "Attacker", cost: 2, ap: 3, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [blocker], shieldArea: [createMockUnit()] },
      { play: [attacker] },
    );
    const blockerId = instanceId(engine, PLAYER_ONE, "Blocker");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "Attacker"),
      attackerPlayerId: PLAYER_TWO,
      target: "direct",
    };
    const candidates = [{ family: "declareBlock" as const, blockerId }];

    expect(iter34BlockerReserve.selectCandidates(context(engine, candidates))).toEqual([
      { family: "declareBlock", blockerId },
    ]);
  });
});

describe("selective-combat experiments: blocking", () => {
  it("declines a losing block when several Shields remain", () => {
    const blocker = createMockUnit({
      name: "Expensive Blocker",
      cost: 4,
      ap: 1,
      hp: 2,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({ name: "Attacker", cost: 2, ap: 4, hp: 4 });
    const shields = [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()];
    const engine = GundamTestEngine.create(
      { play: [blocker], shieldArea: shields },
      { play: [attacker] },
    );
    const blockerId = instanceId(engine, PLAYER_ONE, "Expensive Blocker");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "Attacker"),
      attackerPlayerId: PLAYER_TWO,
      target: "direct",
    };

    expect(iter15SelectiveBlock.selectCandidates(blockCandidates(engine, [blockerId]))).toEqual([]);
  });

  it("blocks when the blocker survives and destroys the attacker", () => {
    const blocker = createMockUnit({
      name: "Favorable Blocker",
      cost: 1,
      ap: 3,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [blocker], shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()] },
      { play: [attacker] },
    );
    const blockerId = instanceId(engine, PLAYER_ONE, "Favorable Blocker");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "Attacker"),
      attackerPlayerId: PLAYER_TWO,
      target: "direct",
    };

    expect(iter15SelectiveBlock.selectCandidates(blockCandidates(engine, [blockerId]))).toEqual([
      { family: "declareBlock", blockerId },
    ]);
  });

  it("sacrifices a cheap blocker to preserve a more valuable targeted Unit", () => {
    const blocker = createMockUnit({
      name: "Cheap Blocker",
      cost: 1,
      ap: 1,
      hp: 1,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const target = createMockUnit({ name: "Valuable Target", cost: 6, ap: 1, hp: 3 });
    const attacker = createMockUnit({ name: "Attacker", cost: 3, ap: 4, hp: 5 });
    const engine = GundamTestEngine.create({ play: [blocker, target] }, { play: [attacker] });
    const blockerId = instanceId(engine, PLAYER_ONE, "Cheap Blocker");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "Attacker"),
      attackerPlayerId: PLAYER_TWO,
      target: instanceId(engine, PLAYER_ONE, "Valuable Target"),
    };

    expect(iter15SelectiveBlock.selectCandidates(blockCandidates(engine, [blockerId]))).toEqual([
      { family: "declareBlock", blockerId },
    ]);
  });

  it("never blocks a High-Maneuver attacker", () => {
    const blocker = createMockUnit({
      name: "Blocker",
      cost: 1,
      ap: 5,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({
      name: "High Maneuver",
      cost: 3,
      ap: 3,
      hp: 3,
      keywordEffects: [{ keyword: "HighManeuver" }],
    });
    const engine = GundamTestEngine.create({ play: [blocker] }, { play: [attacker] });
    const blockerId = instanceId(engine, PLAYER_ONE, "Blocker");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "High Maneuver"),
      attackerPlayerId: PLAYER_TWO,
      target: "direct",
    };

    expect(iter17LastShieldDefense.selectCandidates(blockCandidates(engine, [blockerId]))).toEqual(
      [],
    );
  });

  it("blocks an otherwise lethal direct attack even at a material sacrifice", () => {
    const blocker = createMockUnit({
      name: "Last Defender",
      cost: 5,
      ap: 1,
      hp: 1,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({ name: "Attacker", cost: 1, ap: 5, hp: 5 });
    const engine = GundamTestEngine.create({ play: [blocker] }, { play: [attacker] });
    const blockerId = instanceId(engine, PLAYER_ONE, "Last Defender");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "Attacker"),
      attackerPlayerId: PLAYER_TWO,
      target: "direct",
    };

    expect(iter17LastShieldDefense.selectCandidates(blockCandidates(engine, [blockerId]))).toEqual([
      { family: "declareBlock", blockerId },
    ]);
  });
});

describe("command-utility experiments", () => {
  it("rejects a recovery Command when its target has no damage", () => {
    const unit = createMockUnit({ name: "Healthy Unit", hp: 5 });
    const recovery = createMockCommand({
      name: "Recovery",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "recoverHP",
                amount: 3,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Recover 3 HP.",
        },
      ],
    });
    const engine = GundamTestEngine.create({ hand: [recovery], play: [unit] }, {});
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Recovery");
    const unitId = instanceId(engine, PLAYER_ONE, "Healthy Unit");
    const candidates = [{ family: "playCommand" as const, cardId: commandId, targets: [unitId] }];

    expect(iter20CommandImpact.selectCandidates(context(engine, candidates))).toEqual([]);
  });

  it("keeps recovery when it restores actual HP", () => {
    const unit = createMockUnit({ name: "Damaged Unit", hp: 5 });
    const recovery = createMockCommand({
      name: "Recovery",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "recoverHP",
                amount: 3,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Recover 3 HP.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { hand: [recovery], play: [{ card: unit, damage: 2 }] },
      {},
    );
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Recovery");
    const unitId = instanceId(engine, PLAYER_ONE, "Damaged Unit");
    const candidate = { family: "playCommand" as const, cardId: commandId, targets: [unitId] };

    expect(iter20CommandImpact.selectCandidates(context(engine, [candidate]))).toEqual([candidate]);
  });

  it("ranks lethal Command damage above nonlethal damage", () => {
    const lethalTarget = createMockUnit({ name: "Lethal Target", cost: 4, hp: 3 });
    const healthyTarget = createMockUnit({ name: "Healthy Target", cost: 1, hp: 5 });
    const damage = createMockCommand({
      name: "One Damage",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Deal 1 damage.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { hand: [damage] },
      { play: [{ card: lethalTarget, damage: 2 }, healthyTarget] },
    );
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "One Damage");
    const lethalId = instanceId(engine, PLAYER_TWO, "Lethal Target");
    const healthyId = instanceId(engine, PLAYER_TWO, "Healthy Target");
    const candidates = [
      { family: "playCommand" as const, cardId: commandId, targets: [healthyId] },
      { family: "playCommand" as const, cardId: commandId, targets: [lethalId] },
    ];

    expect(iter20CommandImpact.selectCandidates(context(engine, candidates))[0]).toMatchObject({
      family: "playCommand",
      targets: [lethalId],
    });
  });

  it("defers modest damage while a Unit can be deployed", () => {
    const deployable = createMockUnit({ name: "Deployable", cost: 2, ap: 3, hp: 3 });
    const target = createMockUnit({ name: "Healthy Target", cost: 1, hp: 5 });
    const damage = createMockCommand({
      name: "One Damage",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Deal 1 damage.",
        },
      ],
    });
    const engine = GundamTestEngine.create({ hand: [damage, deployable] }, { play: [target] });
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "One Damage");
    const unitId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Deployable");
    const targetId = instanceId(engine, PLAYER_TWO, "Healthy Target");
    const candidates = [
      { family: "playCommand" as const, cardId: commandId, targets: [targetId] },
      { family: "deployUnit" as const, cardId: unitId },
    ];

    expect(iter22SelectiveCommand.selectCandidates(context(engine, candidates))[0]).toMatchObject({
      family: "deployUnit",
    });
  });

  it("keeps lethal Command damage ahead of deployment", () => {
    const deployable = createMockUnit({ name: "Deployable", cost: 2, ap: 3, hp: 3 });
    const target = createMockUnit({ name: "Lethal Target", cost: 4, hp: 3 });
    const damage = createMockCommand({
      name: "One Damage",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Deal 1 damage.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { hand: [damage, deployable] },
      { play: [{ card: target, damage: 2 }] },
    );
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "One Damage");
    const unitId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Deployable");
    const targetId = instanceId(engine, PLAYER_TWO, "Lethal Target");
    const candidates = [
      { family: "playCommand" as const, cardId: commandId, targets: [targetId] },
      { family: "deployUnit" as const, cardId: unitId },
    ];

    expect(iter22SelectiveCommand.selectCandidates(context(engine, candidates))[0]).toMatchObject({
      family: "playCommand",
    });
  });

  it("uses a dual-mode card as a Command when its effect is decisive", () => {
    const host = createMockUnit({ name: "Host", cost: 2, ap: 2, hp: 3 });
    const target = createMockUnit({ name: "Lethal Target", cost: 4, hp: 3 });
    const dualMode = createMockCommand({
      name: "Dual Mode",
      pilotName: "Weak Pilot",
      apBonus: 0,
      hpBonus: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Deal 1 damage.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { hand: [dualMode], play: [host] },
      { play: [{ card: target, damage: 2 }] },
    );
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Dual Mode");
    const hostId = instanceId(engine, PLAYER_ONE, "Host");
    const targetId = instanceId(engine, PLAYER_TWO, "Lethal Target");
    const candidates = [
      { family: "playCommandAsPilot" as const, cardId: commandId, unitId: hostId },
      { family: "playCommand" as const, cardId: commandId, targets: [targetId] },
    ];

    expect(iter23CommandVsPilot.selectCandidates(context(engine, candidates))[0]).toMatchObject({
      family: "playCommand",
    });
  });

  it("uses a dual-mode card as a Pilot when its Command would have no impact", () => {
    const host = createMockUnit({ name: "Host", cost: 2, ap: 2, hp: 3 });
    const dualMode = createMockCommand({
      name: "Dual Mode",
      pilotName: "Useful Pilot",
      apBonus: 1,
      hpBonus: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "recoverHP",
                amount: 3,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "Recover 3 HP.",
        },
      ],
    });
    const engine = GundamTestEngine.create({ hand: [dualMode], play: [host] }, {});
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Dual Mode");
    const hostId = instanceId(engine, PLAYER_ONE, "Host");
    const candidates = [
      { family: "playCommandAsPilot" as const, cardId: commandId, unitId: hostId },
      { family: "playCommand" as const, cardId: commandId, targets: [hostId] },
    ];

    expect(iter23CommandVsPilot.selectCandidates(context(engine, candidates))[0]).toMatchObject({
      family: "playCommandAsPilot",
    });
  });

  it("keeps a board-creating Command ahead of ordinary deployment", () => {
    const deployable = createMockUnit({ name: "Deployable", cost: 2, ap: 3, hp: 3 });
    const tokenCommand = createMockCommand({
      name: "Token Command",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "deployToken",
                token: { name: "Token", traits: [], ap: 4, hp: 2, deployState: "active" },
              },
            },
          ],
          sourceText: "Deploy a token.",
        },
      ],
    });
    const engine = GundamTestEngine.create({ hand: [tokenCommand, deployable] }, {});
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Token Command");
    const unitId = zoneInstanceId(engine, "hand", PLAYER_ONE, "Deployable");
    const candidates = [
      { family: "playCommand" as const, cardId: commandId },
      { family: "deployUnit" as const, cardId: unitId },
    ];

    expect(iter24TempoAwareCommand.selectCandidates(context(engine, candidates))[0]).toMatchObject({
      family: "playCommand",
    });
  });

  it("retains a Command that grants a Unit a new combat keyword", () => {
    const host = createMockUnit({ name: "Host", cost: 2, ap: 3, hp: 3 });
    const keywordCommand = createMockCommand({
      name: "First Strike Command",
      effects: [
        {
          type: "command",
          activation: { timing: ["main", "action"] },
          directives: [
            {
              action: {
                action: "grantKeyword",
                keyword: "FirstStrike",
                duration: "thisTurn",
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "It gains First Strike.",
        },
      ],
    });
    const engine = GundamTestEngine.create({ hand: [keywordCommand], play: [host] }, {});
    const commandId = zoneInstanceId(engine, "hand", PLAYER_ONE, "First Strike Command");
    const hostId = instanceId(engine, PLAYER_ONE, "Host");
    const candidate = { family: "playCommand" as const, cardId: commandId, targets: [hostId] };

    expect(iter20CommandImpact.selectCandidates(context(engine, [candidate]))).toEqual([candidate]);
  });
});
