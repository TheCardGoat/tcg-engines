import { describe, it, expect } from "vitest";
import type { TriggerQueueEntry, LimitRecord, CoreAbility } from "../types/index.ts";
import {
  sortTriggerQueue,
  removeTriggerById,
  isLimitConsumed,
  consumeLimit,
  clearLimitsForTurn,
  clearAllLimits,
  isSelectableBinding,
  buildBindingChoice,
  buildOptionalChoice,
  buildChooseChoice,
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

// ── Selectable Binding Detection ─────────────────────────────────────────────

describe("isSelectableBinding", () => {
  it("returns true when explicitly selectable", () => {
    const binding = { id: "bind-1", target: "any-target" };
    const result = isSelectableBinding(binding, () => true);
    expect(result).toBe(true);
  });

  it("returns false when not explicitly selectable", () => {
    const binding = { id: "bind-1", target: "fixed-target" };
    const result = isSelectableBinding(binding, () => false);
    expect(result).toBe(false);
  });
});

// ── Pending Choice Envelopes ─────────────────────────────────────────────────

describe("buildBindingChoice", () => {
  it("constructs a binding choice envelope", () => {
    const ability: Ability = { kind: "triggered", text: "", effects: [] };
    const choice = buildBindingChoice("ch-1", "p1", ability, "bind-a", "target-a", 1, 3);
    expect(choice).toEqual({
      choiceId: "ch-1",
      playerId: "p1",
      ability,
      awaiting: {
        type: "binding",
        id: "bind-a",
        target: "target-a",
        min: 1,
        max: 3,
      },
    });
  });
});

describe("buildOptionalChoice", () => {
  it("constructs an optional choice envelope", () => {
    const ability: Ability = { kind: "activated", text: "", effects: [] };
    const choice = buildOptionalChoice("ch-2", "p2", ability, "step-0", "target-b", 0, 1);
    expect(choice.awaiting.type).toBe("optional");
    expect(choice.awaiting.min).toBe(0);
    expect(choice.awaiting.max).toBe(1);
  });
});

describe("buildChooseChoice", () => {
  it("constructs a choose choice envelope", () => {
    const ability: Ability = { kind: "activated", text: "", effects: [] };
    const choice = buildChooseChoice("ch-3", "p1", ability, "step-1", "target-c", 1, 1);
    expect(choice.awaiting.type).toBe("choose");
    expect(choice.awaiting.id).toBe("step-1");
  });
});
