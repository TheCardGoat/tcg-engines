import { describe, expect, it } from "vitest";
import type { TargetEvaluationContext } from "../types/index.ts";
import {
  resolveRelativeOwner,
  compareValues,
  evaluateAttributePredicate,
  normalizeBounds,
  evaluateCoreTargetExpression,
  buildTargetResult,
  buildTargetProjection,
} from "./targeting.ts";

// ── Test Entities ────────────────────────────────────────────────────────────

interface TestEntity {
  id: string;
  owner: string;
  controller: string;
  zone: string;
  attributes: Record<string, unknown>;
}

function makeCtx(
  overrides?: Partial<TargetEvaluationContext<TestEntity, string>>,
): TargetEvaluationContext<TestEntity, string> {
  const entities: TestEntity[] = [
    {
      id: "c1",
      owner: "p1",
      controller: "p1",
      zone: "field",
      attributes: { power: 3, color: "red", traits: ["zeon"] },
    },
    {
      id: "c2",
      owner: "p1",
      controller: "p1",
      zone: "field",
      attributes: { power: 5, color: "blue", traits: ["federation"] },
    },
    {
      id: "c3",
      owner: "p2",
      controller: "p2",
      zone: "field",
      attributes: { power: 4, color: "red", traits: ["zeon", "neo zeon"] },
    },
    {
      id: "c4",
      owner: "p2",
      controller: "p2",
      zone: "hand",
      attributes: { power: 2, color: "green", traits: [] },
    },
  ];

  return {
    sourcePlayerId: "p1",
    sourceEntityId: "c1",
    activePlayerId: "p1",
    opponentOf: (pid) => (pid === "p1" ? "p2" : "p1"),
    allEntities: () => entities,
    entityId: (e) => e.id,
    entityOwner: (e) => e.owner,
    entityController: (e) => e.controller,
    entityZone: (e) => e.zone,
    readAttribute: (e, attr) => e.attributes[attr],
    ...overrides,
  };
}

// ── resolveRelativeOwner ─────────────────────────────────────────────────────

describe("resolveRelativeOwner", () => {
  it("resolves friendly to source player", () => {
    expect(resolveRelativeOwner("friendly", "p1", (pid) => (pid === "p1" ? "p2" : "p1"))).toBe(
      "p1",
    );
  });

  it("resolves opponent via opponentOf", () => {
    expect(resolveRelativeOwner("opponent", "p1", (pid) => (pid === "p1" ? "p2" : "p1"))).toBe(
      "p2",
    );
  });

  it("resolves self to sentinel", () => {
    expect(resolveRelativeOwner("self", "p1", (pid) => (pid === "p1" ? "p2" : "p1"))).toBe("self");
  });

  it("resolves any to sentinel", () => {
    expect(resolveRelativeOwner("any", "p1", (pid) => (pid === "p1" ? "p2" : "p1"))).toBe("any");
  });
});

// ── compareValues ────────────────────────────────────────────────────────────

describe("compareValues", () => {
  it.each([
    [5, "eq", 5, true],
    [5, "eq", 3, false],
    [3, "lt", 5, true],
    [5, "lt", 3, false],
    [3, "lte", 5, true],
    [5, "lte", 5, true],
    [5, "lte", 3, false],
    [5, "gt", 3, true],
    [3, "gt", 5, false],
    [5, "gte", 3, true],
    [5, "gte", 5, true],
    [3, "gte", 5, false],
  ] as const)("compareValues(%d, %s, %d) → %s", (a, op, b, expected) => {
    expect(compareValues(a, op, b)).toBe(expected);
  });
});

// ── evaluateAttributePredicate ───────────────────────────────────────────────

describe("evaluateAttributePredicate", () => {
  it("matches eq for numbers", () => {
    expect(evaluateAttributePredicate({ attribute: "power", comparison: "eq", value: 3 }, 3)).toBe(
      true,
    );
    expect(evaluateAttributePredicate({ attribute: "power", comparison: "eq", value: 3 }, 5)).toBe(
      false,
    );
  });

  it("matches ordered comparisons for numbers", () => {
    expect(evaluateAttributePredicate({ attribute: "power", comparison: "gt", value: 3 }, 5)).toBe(
      true,
    );
    expect(evaluateAttributePredicate({ attribute: "power", comparison: "lt", value: 3 }, 5)).toBe(
      false,
    );
  });

  it("matches string includes/excludes case-insensitively", () => {
    expect(
      evaluateAttributePredicate(
        { attribute: "name", comparison: "includes", value: "gundam" },
        "Gundam RX-78",
      ),
    ).toBe(true);
    expect(
      evaluateAttributePredicate(
        { attribute: "name", comparison: "excludes", value: "gundam" },
        "Zaku II",
      ),
    ).toBe(true);
  });

  it("matches array includes/excludes", () => {
    expect(
      evaluateAttributePredicate({ attribute: "traits", comparison: "includes", value: "zeon" }, [
        "zeon",
        "neo zeon",
      ]),
    ).toBe(true);
    expect(
      evaluateAttributePredicate(
        { attribute: "traits", comparison: "excludes", value: "federation" },
        ["zeon", "neo zeon"],
      ),
    ).toBe(true);
  });

  it("handles neq", () => {
    expect(
      evaluateAttributePredicate({ attribute: "color", comparison: "neq", value: "red" }, "blue"),
    ).toBe(true);
    expect(
      evaluateAttributePredicate({ attribute: "color", comparison: "neq", value: "red" }, "red"),
    ).toBe(false);
  });
});

// ── normalizeBounds ──────────────────────────────────────────────────────────

describe("normalizeBounds", () => {
  it("defaults to min 1 max 1 when undefined", () => {
    expect(normalizeBounds(undefined, 10)).toEqual({ min: 1, max: 1 });
  });

  it("handles exact count", () => {
    expect(normalizeBounds(3, 10)).toEqual({ min: 3, max: 3 });
  });

  it("handles 'all'", () => {
    expect(normalizeBounds("all", 7)).toEqual({ min: 7, max: 7 });
  });

  it("handles SelectionBounds", () => {
    expect(normalizeBounds({ min: 1, max: 3 }, 10)).toEqual({ min: 1, max: 3 });
    expect(normalizeBounds({ min: 1, max: "all" }, 5)).toEqual({ min: 1, max: 5 });
  });
});

// ── evaluateCoreTargetExpression ─────────────────────────────────────────────

describe("evaluateCoreTargetExpression", () => {
  const ctx = makeCtx();
  const candidates = ctx.allEntities();

  it("filters by owner friendly", () => {
    const result = evaluateCoreTargetExpression(
      { op: "owner", owner: "friendly" },
      ctx,
      candidates,
    );
    expect(result.map((e) => e.id)).toEqual(["c1", "c2"]);
  });

  it("filters by owner opponent", () => {
    const result = evaluateCoreTargetExpression(
      { op: "owner", owner: "opponent" },
      ctx,
      candidates,
    );
    expect(result.map((e) => e.id)).toEqual(["c3", "c4"]);
  });

  it("filters by owner any", () => {
    const result = evaluateCoreTargetExpression({ op: "owner", owner: "any" }, ctx, candidates);
    expect(result.map((e) => e.id)).toEqual(["c1", "c2", "c3", "c4"]);
  });

  it("leaves kind filtering to the game layer", () => {
    const result = evaluateCoreTargetExpression({ op: "kind", kind: "card" }, ctx, candidates);
    expect(result).toBe(candidates);
  });

  it("filters by zone", () => {
    const result = evaluateCoreTargetExpression({ op: "zone", zones: ["field"] }, ctx, candidates);
    expect(result.map((e) => e.id)).toEqual(["c1", "c2", "c3"]);
  });

  it("filters by attribute eq", () => {
    const result = evaluateCoreTargetExpression(
      { op: "attribute", predicate: { attribute: "color", comparison: "eq", value: "red" } },
      ctx,
      candidates,
    );
    expect(result.map((e) => e.id)).toEqual(["c1", "c3"]);
  });

  it("filters by attribute gt", () => {
    const result = evaluateCoreTargetExpression(
      { op: "attribute", predicate: { attribute: "power", comparison: "gt", value: 3 } },
      ctx,
      candidates,
    );
    expect(result.map((e) => e.id)).toEqual(["c2", "c3"]);
  });

  it("filters by excludeSource", () => {
    const result = evaluateCoreTargetExpression(
      { op: "excludeSource", sourceId: "c1" },
      ctx,
      candidates,
    );
    expect(result.map((e) => e.id)).toEqual(["c2", "c3", "c4"]);
  });

  it("composes with and", () => {
    const result = evaluateCoreTargetExpression(
      {
        op: "and",
        filters: [
          { op: "owner", owner: "friendly" },
          { op: "zone", zones: ["field"] },
        ],
      },
      ctx,
      candidates,
    );
    expect(result.map((e) => e.id)).toEqual(["c1", "c2"]);
  });

  it("composes with or", () => {
    const result = evaluateCoreTargetExpression(
      {
        op: "or",
        filters: [
          { op: "attribute", predicate: { attribute: "power", comparison: "eq", value: 5 } },
          { op: "attribute", predicate: { attribute: "power", comparison: "eq", value: 2 } },
        ],
      },
      ctx,
      candidates,
    );
    expect(result.map((e) => e.id)).toEqual(["c2", "c4"]);
  });
});

// ── buildTargetResult ────────────────────────────────────────────────────────

describe("buildTargetResult", () => {
  it("builds result with exact count", () => {
    const result = buildTargetResult(["a", "b", "c"], 2);
    expect(result).toEqual({ entityIds: ["a", "b", "c"], min: 2, max: 2, ordered: false });
  });

  it("builds result with bounds", () => {
    const result = buildTargetResult(["a", "b", "c"], { min: 1, max: "all" });
    expect(result).toEqual({ entityIds: ["a", "b", "c"], min: 1, max: 3, ordered: false });
  });
});

// ── buildTargetProjection ────────────────────────────────────────────────────

describe("buildTargetProjection", () => {
  it("builds both engine and protocol results", () => {
    const disabled = new Map<string, string>();
    disabled.set("b", "already spent");

    const result = buildTargetProjection(["a", "b"], "card", { min: 1, max: 2 }, false, disabled);

    expect(result.engine.entityIds).toEqual(["a", "b"]);
    expect(result.engine.min).toBe(1);
    expect(result.engine.max).toBe(2);
    expect(result.protocol.candidates).toEqual([
      { id: "a", kind: "card" },
      { id: "b", kind: "card", disabledReason: "already spent" },
    ]);
  });
});
