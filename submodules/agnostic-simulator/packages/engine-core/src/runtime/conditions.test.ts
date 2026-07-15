import { describe, expect, it } from "vitest";
import type { TargetEvaluationContext } from "../types/index.ts";
import type { CoreCondition, ConditionPredicateAdapter } from "../types/index.ts";
import {
  evaluateCoreCondition,
  evaluateNumericCondition,
  evaluateStringCondition,
} from "./conditions.ts";

interface TestCtx {
  value: number;
}

const adapter: ConditionPredicateAdapter<CoreCondition, TestCtx> = {
  evaluate(condition, ctx) {
    if (condition.type === "custom") {
      return ctx.value > (condition.payload as number);
    }
    if (condition.type === "entityCount") {
      return (
        ctx.value >=
        ((condition as Extract<typeof condition, { type: "entityCount" }>).value as number)
      );
    }
    if (condition.type === "attribute") {
      return (
        ctx.value ===
        ((condition as Extract<typeof condition, { type: "attribute" }>).value as number)
      );
    }
    return false;
  },
};

const targetCtx: TargetEvaluationContext<unknown, string> = {
  sourcePlayerId: "p1",
  sourceEntityId: "c1",
  activePlayerId: "p1",
  opponentOf: (pid) => (pid === "p1" ? "p2" : "p1"),
  allEntities: () => [],
  entityId: () => "",
  entityOwner: () => "",
  entityController: () => "",
  entityZone: () => "field",
  readAttribute: () => undefined,
};

describe("evaluateCoreCondition", () => {
  it("evaluates and (all must be true)", () => {
    const condition: CoreCondition = {
      type: "and",
      conditions: [
        { type: "custom", payload: 5 },
        { type: "custom", payload: 3 },
      ],
    };
    expect(evaluateCoreCondition(condition, { value: 10 }, adapter)).toBe(true);
    expect(evaluateCoreCondition(condition, { value: 4 }, adapter)).toBe(false);
  });

  it("evaluates or (at least one true)", () => {
    const condition: CoreCondition = {
      type: "or",
      conditions: [
        { type: "custom", payload: 15 },
        { type: "custom", payload: 3 },
      ],
    };
    expect(evaluateCoreCondition(condition, { value: 10 }, adapter)).toBe(true);
    expect(evaluateCoreCondition(condition, { value: 2 }, adapter)).toBe(false);
  });

  it("evaluates not", () => {
    const condition: CoreCondition = {
      type: "not",
      condition: { type: "custom", payload: 5 },
    };
    expect(evaluateCoreCondition(condition, { value: 10 }, adapter)).toBe(false);
    expect(evaluateCoreCondition(condition, { value: 3 }, adapter)).toBe(true);
  });

  it("evaluates turn for friendly", () => {
    const condition: CoreCondition = { type: "turn", player: "friendly" };
    expect(evaluateCoreCondition(condition, { value: 0 }, adapter, targetCtx)).toBe(true);

    const opponentCtx = { ...targetCtx, activePlayerId: "p2" };
    expect(evaluateCoreCondition(condition, { value: 0 }, adapter, opponentCtx)).toBe(false);
  });

  it("uses current turn player when it is available", () => {
    const condition: CoreCondition = { type: "turn", player: "friendly" };
    const parallelDecisionCtx = {
      ...targetCtx,
      activePlayerId: "p2",
      currentTurnPlayerId: "p1",
    };

    expect(evaluateCoreCondition(condition, { value: 0 }, adapter, parallelDecisionCtx)).toBe(true);
  });

  it("evaluates turn for opponent", () => {
    const condition: CoreCondition = { type: "turn", player: "opponent" };
    expect(evaluateCoreCondition(condition, { value: 0 }, adapter, targetCtx)).toBe(false);

    const opponentCtx = { ...targetCtx, activePlayerId: "p2" };
    expect(evaluateCoreCondition(condition, { value: 0 }, adapter, opponentCtx)).toBe(true);
  });

  it("delegates entityCount to adapter", () => {
    const condition: CoreCondition = {
      type: "entityCount",
      target: {},
      comparison: "gte",
      value: 5,
    };
    expect(evaluateCoreCondition(condition, { value: 10 }, adapter, targetCtx)).toBe(true);
    expect(evaluateCoreCondition(condition, { value: 3 }, adapter, targetCtx)).toBe(false);
  });

  it("delegates attribute to adapter", () => {
    const condition: CoreCondition = {
      type: "attribute",
      target: {},
      attribute: "power",
      comparison: "eq",
      value: 10,
    };
    expect(evaluateCoreCondition(condition, { value: 10 }, adapter, targetCtx)).toBe(true);
    expect(evaluateCoreCondition(condition, { value: 5 }, adapter, targetCtx)).toBe(false);
  });

  it("delegates unknown predicates to adapter", () => {
    const condition: CoreCondition = { type: "custom", payload: 5 };
    expect(evaluateCoreCondition(condition, { value: 10 }, adapter)).toBe(true);
    expect(evaluateCoreCondition(condition, { value: 3 }, adapter)).toBe(false);
  });
});

describe("evaluateNumericCondition", () => {
  it.each([
    [5, "eq", 5, true],
    [5, "gt", 3, true],
    [3, "lt", 5, true],
    [5, "gte", 5, true],
    [3, "lte", 5, true],
  ] as const)("evaluateNumericCondition(%d, %s, %d)", (a, op, b, expected) => {
    expect(evaluateNumericCondition(a, op, b)).toBe(expected);
  });
});

describe("evaluateStringCondition", () => {
  it("matches eq", () => {
    expect(evaluateStringCondition("foo", "eq", "foo")).toBe(true);
    expect(evaluateStringCondition("foo", "eq", "bar")).toBe(false);
  });

  it("matches neq", () => {
    expect(evaluateStringCondition("foo", "neq", "bar")).toBe(true);
    expect(evaluateStringCondition("foo", "neq", "foo")).toBe(false);
  });

  it("matches includes case-insensitively", () => {
    expect(evaluateStringCondition("Gundam", "includes", "gun")).toBe(true);
    expect(evaluateStringCondition("Gundam", "includes", "zaku")).toBe(false);
  });

  it("matches excludes case-insensitively", () => {
    expect(evaluateStringCondition("Gundam", "excludes", "zaku")).toBe(true);
    expect(evaluateStringCondition("Gundam", "excludes", "gun")).toBe(false);
  });
});
