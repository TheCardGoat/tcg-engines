/**
 * Structured logging — sanity coverage for wave 1 (moves).
 *
 * Asserts that each move that now calls `emitGundamLog` produces exactly
 * one log entry with the right `type` and values. The typed entry is
 * preserved under `data`; top-level fields are the framework's generic
 * `LogEntry` shape.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  createMockBase,
  createMockResource,
} from "../index.ts";
import type { TestCardEntry } from "../index.ts";
import type { GundamGameLogEntry } from "./logging.ts";

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}
function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

// Narrow a raw runtime log entry to its typed Gundam payload.
function typedLog(entry: { data?: Record<string, unknown> }): GundamGameLogEntry {
  return entry.data as unknown as GundamGameLogEntry;
}

describe("emitGundamLog — wave 1 move coverage", () => {
  it("deployUnit emits gundam.move.deployUnit", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(1) }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    const result = p1.deployUnit(unit);
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    const logs = result.logEntries.filter((e) => e.type === "gundam.move.deployUnit");
    expect(logs).toHaveLength(1);

    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.move.deployUnit") throw new Error("wrong type");
    expect(entry.values.playerId).toBe(PLAYER_ONE);
    expect(entry.values.cost).toBe(1);
    expect(entry.visibility.mode).toBe("PUBLIC");
    expect(entry.category).toBe("action");
  });

  it("deployBase emits gundam.move.deployBase", () => {
    const base = createMockBase({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [base], resourceArea: resources(1) }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    const result = p1.deployBase(base);
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    const logs = result.logEntries.filter((e) => e.type === "gundam.move.deployBase");
    expect(logs).toHaveLength(1);
    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.move.deployBase") throw new Error("wrong type");
    expect(entry.values.cost).toBe(1);
  });

  it("passTurn emits gundam.move.pass with context=turn", () => {
    const engine = GundamTestEngine.create({}, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.passPhase();
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    const logs = result.logEntries.filter((e) => e.type === "gundam.move.pass");
    expect(logs).toHaveLength(1);
    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.move.pass") throw new Error("wrong type");
    expect(entry.values.context).toBe("turn");
    expect(entry.values.playerId).toBe(PLAYER_ONE);
  });
});

describe("emitGundamLog — pending queue coverage", () => {
  it("activated ability that halts for target choice emits pending.enqueued", () => {
    const restEnemy: Parameters<typeof createMockUnit>[0] = {
      ap: 1,
      hp: 1,
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { restSelf: true },
          directives: [
            {
              action: {
                action: "rest",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】 Rest this Unit: rest 1 enemy.",
        },
      ],
    };
    const source = createMockUnit(restEnemy);
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [source], resourceArea: resources(1) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    // No targets committed — halts on the pending queue.
    const result = p1.activateAbility(source, 0, {});
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    const logs = result.logEntries.filter((e) => e.type === "gundam.pending.enqueued");
    expect(logs.length).toBeGreaterThanOrEqual(1);
    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.pending.enqueued") throw new Error("wrong type");
    expect(entry.values.kind).toBe("activated");
    expect(entry.values.controllerId).toBe(PLAYER_ONE);
    expect(entry.category).toBe("system");
  });

  it("resolveEffect emits pending.resolved", () => {
    const restEnemy: Parameters<typeof createMockUnit>[0] = {
      ap: 1,
      hp: 1,
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { restSelf: true },
          directives: [
            {
              action: {
                action: "rest",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】 Rest this Unit: rest 1 enemy.",
        },
      ],
    };
    const source = createMockUnit(restEnemy);
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [source], resourceArea: resources(1) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    // Activate halts; resolve it manually with a chosen target.
    expectSuccess(p1.activateAbility(source, 0, {}));
    const result = p1.resolveEffect({ targets: [enemyId] });
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    const logs = result.logEntries.filter((e) => e.type === "gundam.pending.resolved");
    expect(logs.length).toBeGreaterThanOrEqual(1);
  });
});

describe("emitGundamLog — wave 6 effect coverage", () => {
  it("draw effect emits public summary + private detail entries", () => {
    const drawTwo: Parameters<typeof createMockUnit>[0] = {
      ap: 1,
      hp: 1,
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { restSelf: true },
          directives: [{ action: { action: "draw", count: 2 } }],
          sourceText: "【Activate･Main】 Rest this Unit: Draw 2.",
        },
      ],
    };
    const source = createMockUnit(drawTwo);
    const engine = GundamTestEngine.create(
      { play: [source], resourceArea: resources(1), deck: 5 },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.activateAbility(source, 0, {});
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    const drawnLogs = result.logEntries.filter((e) => e.type === "gundam.effect.cardsDrawn");
    expect(drawnLogs).toHaveLength(2);

    const publicEntry = typedLog(drawnLogs[0]!);
    const privateEntry = typedLog(drawnLogs[1]!);
    if (publicEntry.type !== "gundam.effect.cardsDrawn") throw new Error("wrong type");
    if (privateEntry.type !== "gundam.effect.cardsDrawn") throw new Error("wrong type");

    expect(publicEntry.values.count).toBe(2);
    expect(publicEntry.values.cardIds).toBeUndefined();
    expect(publicEntry.visibility.mode).toBe("PUBLIC");

    expect(privateEntry.values.cardIds).toHaveLength(2);
    expect(privateEntry.visibility.mode).toBe("PRIVATE");
  });

  it("rest effect emits gundam.effect.exhausted per target", () => {
    const restEnemy: Parameters<typeof createMockUnit>[0] = {
      ap: 1,
      hp: 1,
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { restSelf: true },
          directives: [
            {
              action: {
                action: "rest",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】 Rest this Unit: rest an enemy.",
        },
      ],
    };
    const source = createMockUnit(restEnemy);
    const victim = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [source], resourceArea: resources(1) },
      { play: [victim] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const victimId = p2.getCardsInZone("battleArea")[0]!;
    const result = p1.activateAbility(source, 0, { targets: [victimId] });
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    const logs = result.logEntries.filter((e) => e.type === "gundam.effect.exhausted");
    expect(logs.length).toBeGreaterThanOrEqual(1);
    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.effect.exhausted") throw new Error("wrong type");
    expect(entry.values.cardId).toBe(victimId);
  });
});

describe("emitGundamLog — wave 5 lifecycle coverage", () => {
  it("passPhase emits at least one gundam.phase.entered as the flow transitions", () => {
    // passTurn lands the flow in end-phase and cascades through its
    // steps via onEnter hooks; each emits a phase.entered system log.
    // We don't assert which specific phase/step appears (that depends on
    // test-engine's initial state), only that the wiring fires at least
    // one entry in the command's log trail.
    const engine = GundamTestEngine.create({}, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.passPhase();
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    const phaseLogs = result.logEntries.filter((e) => e.type === "gundam.phase.entered");
    expect(phaseLogs.length).toBeGreaterThanOrEqual(1);

    const entry = typedLog(phaseLogs[0]!);
    if (entry.type !== "gundam.phase.entered") throw new Error("wrong type");
    expect(typeof entry.values.phase).toBe("string");
    expect(entry.visibility.mode).toBe("PUBLIC");
    expect(entry.category).toBe("system");
  });

  it("draw phase records public draw count + private card ids on the transition move log", () => {
    const engine = GundamTestEngine.create({}, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    const result = p1.passActionStep();
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    if (!result.moveLogs) throw new Error("Expected structured move logs");

    const passLog = result.moveLogs[0];
    expect(passLog?.type).toBe("pass");
    expect(passLog?.outcomes?.cardsDrawn?.count).toBe(1);
    expect(passLog?.outcomes?.cardsDrawn?.playerId).toBe(PLAYER_TWO);
    expect(passLog?.outcomes?.cardsDrawn?.cardIds).toMatchObject({
      __private: true,
      visibleTo: [PLAYER_TWO],
    });
  });
});

describe("emitGundamLog — wave 4 combat coverage", () => {
  it("handleDealDamageAction emits gundam.combat.damageDealt with cardId/amount/sourceCardId", () => {
    // Deal 1 damage to opponent's unit via an activated ability — simplest
    // path into logCombatDamage that doesn't need a full battle.
    const source = createMockUnit({
      ap: 1,
      hp: 1,
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { restSelf: true },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】 Rest this Unit: deal 1 damage.",
        },
      ],
    });
    const victim = createMockUnit({ ap: 1, hp: 3 });

    const engine = GundamTestEngine.create(
      { play: [source], resourceArea: resources(1) },
      { play: [victim] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const victimId = p2.getCardsInZone("battleArea")[0]!;

    const result = p1.activateAbility(source, 0, { targets: [victimId] });
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    const logs = result.logEntries.filter((e) => e.type === "gundam.combat.damageDealt");
    expect(logs.length).toBeGreaterThanOrEqual(1);
    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.combat.damageDealt") throw new Error("wrong type");
    expect(entry.values.cardId).toBe(victimId);
    expect(entry.values.amount).toBe(1);
    expect(entry.values.sourceCardId).toBe(sourceId);
    expect(entry.visibility.mode).toBe("PUBLIC");
  });
});

describe("emitGundamLog — wave 3 cost coverage", () => {
  it("deployUnit paying 2 regular resources emits gundam.cost.resourcesSpent { regularCount: 2, exRemovedCount: 0 }", () => {
    const unit = createMockUnit({ level: 2, cost: 2 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    const result = p1.deployUnit(unit);
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    const logs = result.logEntries.filter((e) => e.type === "gundam.cost.resourcesSpent");
    expect(logs).toHaveLength(1);
    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.cost.resourcesSpent") throw new Error("wrong type");
    expect(entry.values.playerId).toBe(PLAYER_ONE);
    expect(entry.values.regularCount).toBe(2);
    expect(entry.values.exRemovedCount).toBe(0);
  });

  it("deployUnit that spills into an EX token logs exRemovedCount=1", () => {
    const unit = createMockUnit({ level: 2, cost: 2 });
    const reg = createMockResource();
    const exRes = createMockResource();
    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: [active(reg), active(exRes)] },
      {},
    );
    const state = engine.getState();
    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    const exId = resourceIds[1]!;
    state.ctx.zones.private.cardMeta[exId] = { isToken: true };

    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.deployUnit(unit);
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    const logs = result.logEntries.filter((e) => e.type === "gundam.cost.resourcesSpent");
    expect(logs).toHaveLength(1);
    const entry = typedLog(logs[0]!);
    if (entry.type !== "gundam.cost.resourcesSpent") throw new Error("wrong type");
    expect(entry.values.regularCount).toBe(1);
    expect(entry.values.exRemovedCount).toBe(1);
  });

  it("cost-free play does not emit gundam.cost.resourcesSpent", () => {
    const unit = createMockUnit({ level: 0, cost: 0 });
    const engine = GundamTestEngine.create({ hand: [unit] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.deployUnit(unit);
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");
    const logs = result.logEntries.filter((e) => e.type === "gundam.cost.resourcesSpent");
    expect(logs).toHaveLength(0);
  });
});
