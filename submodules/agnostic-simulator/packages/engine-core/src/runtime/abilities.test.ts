import { describe, it, expect } from "vitest";
import type { TriggerQueueEntry, LimitRecord, CoreAbility } from "../types/index.ts";
import {
  sortTriggerQueue,
  removeTriggerById,
  isLimitConsumed,
  consumeLimit,
  clearLimitsForTurn,
  clearAllLimits,
} from "./abilities.ts";

// ── Dummy Types ──────────────────────────────────────────────────────────────
type Trigger = { event: string };
type Ability = CoreAbility<Trigger, unknown, unknown, unknown, string>;

function makeEntry(
  id: string,
  order: number,
  playerId: string,
): TriggerQueueEntry<Trigger, Ability> {
  return {
    id,
    order,
    playerId,
    sourceCardId: `card-${id}`,
    trigger: { event: "test" },
    ability: { kind: "triggered", text: "", effects: [] },
  };
}

// ── Trigger Queue ────────────────────────────────────────────────────────────

describe("sortTriggerQueue", () => {
  it("sorts active player's triggers before opponent's", () => {
    const entries = [
      makeEntry("a", 1, "p2"),
      makeEntry("b", 2, "p1"),
      makeEntry("c", 3, "p2"),
      makeEntry("d", 4, "p1"),
    ];
    const sorted = sortTriggerQueue(entries, "p1");
    expect(sorted.map((e) => e.id)).toEqual(["b", "d", "a", "c"]);
  });

  it("falls back to order when same player", () => {
    const entries = [makeEntry("a", 3, "p1"), makeEntry("b", 1, "p1"), makeEntry("c", 2, "p1")];
    const sorted = sortTriggerQueue(entries, "p1");
    expect(sorted.map((e) => e.id)).toEqual(["b", "c", "a"]);
  });
});

describe("removeTriggerById", () => {
  it("removes the matching entry", () => {
    const entries = [makeEntry("a", 1, "p1"), makeEntry("b", 2, "p1")];
    const result = removeTriggerById(entries, "a");
    expect(result.map((e) => e.id)).toEqual(["b"]);
  });
});

// ── Limit Bookkeeping ────────────────────────────────────────────────────────

describe("isLimitConsumed", () => {
  it("returns true when the exact limit was fired this turn", () => {
    const records: LimitRecord[] = [
      { limitId: "opt", sourceCardId: "c1", turnNumber: 3, fired: true },
    ];
    expect(isLimitConsumed(records, "opt", "c1", 3)).toBe(true);
  });

  it("returns false for a different turn", () => {
    const records: LimitRecord[] = [
      { limitId: "opt", sourceCardId: "c1", turnNumber: 2, fired: true },
    ];
    expect(isLimitConsumed(records, "opt", "c1", 3)).toBe(false);
  });

  it("returns false for a different card", () => {
    const records: LimitRecord[] = [
      { limitId: "opt", sourceCardId: "c1", turnNumber: 3, fired: true },
    ];
    expect(isLimitConsumed(records, "opt", "c2", 3)).toBe(false);
  });
});

describe("consumeLimit", () => {
  it("adds a fired record", () => {
    const records: LimitRecord[] = [];
    consumeLimit(records, "opt", "c1", 5);
    expect(records).toHaveLength(1);
    expect(records[0]).toEqual({
      limitId: "opt",
      sourceCardId: "c1",
      turnNumber: 5,
      fired: true,
    });
  });
});

describe("clearLimitsForTurn", () => {
  it("removes only records for the specified turn", () => {
    const records: LimitRecord[] = [
      { limitId: "a", sourceCardId: "c1", turnNumber: 1, fired: true },
      { limitId: "b", sourceCardId: "c1", turnNumber: 2, fired: true },
      { limitId: "c", sourceCardId: "c1", turnNumber: 2, fired: true },
    ];
    clearLimitsForTurn(records, 2);
    expect(records.map((r) => r.limitId)).toEqual(["a"]);
  });
});

describe("clearAllLimits", () => {
  it("removes every record", () => {
    const records: LimitRecord[] = [
      { limitId: "a", sourceCardId: "c1", turnNumber: 1, fired: true },
      { limitId: "b", sourceCardId: "c2", turnNumber: 3, fired: true },
    ];
    clearAllLimits(records);
    expect(records).toHaveLength(0);
  });
});
