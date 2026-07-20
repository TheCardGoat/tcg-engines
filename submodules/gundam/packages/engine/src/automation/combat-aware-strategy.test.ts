import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockCommand,
  createMockUnit,
} from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";

import { enumerateGundamBotCandidates } from "./candidate-enumerator.ts";
import { combatAwareStrategy } from "./combat-aware-strategy.ts";
import type { GundamBotCandidate } from "./candidate-types.ts";

function strategyContext(
  engine: GundamTestEngine,
  candidates: readonly GundamBotCandidate[] = enumerateGundamBotCandidates(
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

function instanceId(engine: GundamTestEngine, playerId: string, name: string): string {
  const view = engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId });
  const card = view.zones.zones[`battleArea:${playerId}`]?.cards.find(
    (candidate) => candidate.definition?.name === name,
  );
  if (!card) throw new Error(`Missing ${name}`);
  return card.instanceId;
}

function handInstanceId(engine: GundamTestEngine, name: string): string {
  const view = engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId });
  const card = view.zones.zones[`hand:${PLAYER_ONE}`]?.cards.find(
    (candidate) => candidate.definition?.name === name,
  );
  if (!card) throw new Error(`Missing ${name} in hand`);
  return card.instanceId;
}

function firstAttack(engine: GundamTestEngine) {
  return combatAwareStrategy
    .selectCandidates(strategyContext(engine))
    .find((candidate) => candidate.family === "enterBattle");
}

function selectedBlocks(engine: GundamTestEngine, blockerIds: readonly string[]) {
  const candidates = blockerIds.map(
    (blockerId) => ({ family: "declareBlock", blockerId }) as const,
  );
  return combatAwareStrategy.selectCandidates(strategyContext(engine, candidates));
}

describe("combatAwareStrategy attacks", () => {
  it("uses effective AP when ranking a lethal Unit attack", () => {
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

    expect(firstAttack(engine)).toMatchObject({
      family: "enterBattle",
      attackerId: boostedId,
      target: instanceId(engine, PLAYER_TWO, "Target"),
    });
  });

  it("keeps direct pressure ahead of an unfavorable Unit sacrifice", () => {
    const attacker = createMockUnit({ name: "Small Attacker", cost: 4, ap: 2, hp: 2 });
    const target = createMockUnit({ name: "Large Target", cost: 1, ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }], shieldArea: [createMockUnit()] },
    );

    expect(firstAttack(engine)).toMatchObject({ family: "enterBattle", target: "direct" });
  });

  it("accounts for First Strike preventing retaliation", () => {
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

    expect(firstAttack(engine)).toMatchObject({
      family: "enterBattle",
      target: instanceId(engine, PLAYER_TWO, "Dangerous Target"),
    });
  });

  it("uses the higher-AP attacker against a Base before Shields", () => {
    const light = createMockUnit({ name: "Light", cost: 1, ap: 1, hp: 2 });
    const heavy = createMockUnit({ name: "Heavy", cost: 3, ap: 5, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [light, heavy] },
      { baseSection: [createMockBase({ hp: 5 })], shieldArea: [createMockUnit()] },
    );

    expect(firstAttack(engine)).toMatchObject({
      family: "enterBattle",
      attackerId: instanceId(engine, PLAYER_ONE, "Heavy"),
      target: "direct",
    });
  });
});

describe("combatAwareStrategy blocks", () => {
  it("declines a losing block when several Shields remain", () => {
    const blocker = createMockUnit({
      name: "Expensive Blocker",
      cost: 4,
      ap: 1,
      hp: 2,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const attacker = createMockUnit({ name: "Attacker", cost: 2, ap: 4, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [blocker],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit(), createMockUnit()],
      },
      { play: [attacker] },
    );
    const blockerId = instanceId(engine, PLAYER_ONE, "Expensive Blocker");
    engine.getG().turnMetadata.pendingCombat = {
      stage: "block-step",
      attackerId: instanceId(engine, PLAYER_TWO, "Attacker"),
      attackerPlayerId: PLAYER_TWO,
      target: "direct",
    };

    expect(selectedBlocks(engine, [blockerId])).toEqual([]);
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

    expect(selectedBlocks(engine, [blockerId])).toEqual([{ family: "declareBlock", blockerId }]);
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

    expect(selectedBlocks(engine, [blockerId])).toEqual([{ family: "declareBlock", blockerId }]);
  });

  it("does not emit a Blocker against High-Maneuver", () => {
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

    expect(selectedBlocks(engine, [blockerId])).toEqual([]);
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

    expect(selectedBlocks(engine, [blockerId])).toEqual([{ family: "declareBlock", blockerId }]);
  });
});

describe("combatAwareStrategy Commands", () => {
  it("defers an attrition Command until persistent development is exhausted", () => {
    const deployable = createMockUnit({ name: "Deployable", cost: 2, ap: 3, hp: 3 });
    const target = createMockUnit({ name: "Target", cost: 1, hp: 5 });
    const command = createMockCommand({
      name: "Chip Damage",
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
    const engine = GundamTestEngine.create({ hand: [command, deployable] }, { play: [target] });
    const candidates = [
      {
        family: "playCommand" as const,
        cardId: handInstanceId(engine, "Chip Damage"),
        targets: [instanceId(engine, PLAYER_TWO, "Target")],
      },
      { family: "deployUnit" as const, cardId: handInstanceId(engine, "Deployable") },
    ];

    expect(
      combatAwareStrategy.selectCandidates(strategyContext(engine, candidates))[0],
    ).toMatchObject({
      family: "deployUnit",
    });
  });

  it("keeps a board-creating Command ahead of ordinary deployment", () => {
    const deployable = createMockUnit({ name: "Deployable", cost: 2, ap: 3, hp: 3 });
    const command = createMockCommand({
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
    const engine = GundamTestEngine.create({ hand: [command, deployable] }, {});
    const candidates = [
      { family: "playCommand" as const, cardId: handInstanceId(engine, "Token Command") },
      { family: "deployUnit" as const, cardId: handInstanceId(engine, "Deployable") },
    ];

    expect(
      combatAwareStrategy.selectCandidates(strategyContext(engine, candidates))[0],
    ).toMatchObject({
      family: "playCommand",
    });
  });

  it("does not discard a useful combat-keyword Command as a no-op", () => {
    const host = createMockUnit({ name: "Host", cost: 2, ap: 3, hp: 3 });
    const command = createMockCommand({
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
    const engine = GundamTestEngine.create({ hand: [command], play: [host] }, {});
    const candidate = {
      family: "playCommand" as const,
      cardId: handInstanceId(engine, "First Strike Command"),
      targets: [instanceId(engine, PLAYER_ONE, "Host")],
    };

    expect(combatAwareStrategy.selectCandidates(strategyContext(engine, [candidate]))).toEqual([
      candidate,
    ]);
  });
});
