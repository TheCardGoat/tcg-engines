import { describe, expect, it, vi } from "vitest";
import type { CoreEffectNode, PrimitiveRuntime } from "../types/index.ts";
import {
  resolvePrimitiveValue,
  runSequence,
  runParallel,
  runConditional,
  runRepeat,
  suspendForChoice,
  runEffectNode,
} from "./effects.ts";

// ── Mock Runtime ─────────────────────────────────────────────────────────────

function mockRuntime(
  applyResult: { status: "resolved" | "blocked" | "suspended"; blockedReason?: string } = {
    status: "resolved",
  },
): PrimitiveRuntime<string> {
  return {
    preview: vi.fn(() => []),
    apply: vi.fn(() => applyResult),
  };
}

// ── resolvePrimitiveValue ────────────────────────────────────────────────────

describe("resolvePrimitiveValue", () => {
  it("resolves literal values", () => {
    expect(
      resolvePrimitiveValue(
        { kind: "literal", value: 5 },
        () => 0,
        () => null,
      ),
    ).toBe(5);
    expect(
      resolvePrimitiveValue(
        { kind: "literal", value: "hello" },
        () => 0,
        () => null,
      ),
    ).toBe("hello");
  });

  it("resolves count with multiplier", () => {
    expect(
      resolvePrimitiveValue(
        { kind: "count", target: { kind: "resolved", id: "t1" }, multiplier: 2 },
        () => 3,
        () => null,
      ),
    ).toBe(6);
  });

  it("resolves attribute when numeric", () => {
    expect(
      resolvePrimitiveValue(
        { kind: "attribute", target: { kind: "resolved", id: "t1" }, attribute: "power" },
        () => 0,
        () => 7,
      ),
    ).toBe(7);
  });

  it("resolves attribute to null when not primitive", () => {
    expect(
      resolvePrimitiveValue(
        { kind: "attribute", target: { kind: "resolved", id: "t1" }, attribute: "obj" },
        () => 0,
        () => ({ nested: true }),
      ),
    ).toBe(null);
  });
});

// ── runSequence ──────────────────────────────────────────────────────────────

describe("runSequence", () => {
  it("runs all steps and returns resolved", () => {
    const runtime = mockRuntime();
    const steps: CoreEffectNode[] = [
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c1" },
        key: "x",
        value: { kind: "literal", value: 1 },
      },
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c2" },
        key: "y",
        value: { kind: "literal", value: 2 },
      },
    ];
    const result = runSequence(steps, runtime, "ctx");
    expect(result.status).toBe("resolved");
    expect(runtime.apply).toHaveBeenCalledTimes(2);
  });

  it("blocks on first blocked step and returns remaining", () => {
    const runtime = mockRuntime({ status: "blocked", blockedReason: "no target" });
    const steps: CoreEffectNode[] = [
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c1" },
        key: "x",
        value: { kind: "literal", value: 1 },
      },
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c2" },
        key: "y",
        value: { kind: "literal", value: 2 },
      },
    ];
    const result = runSequence(steps, runtime, "ctx");
    expect(result.status).toBe("blocked");
    expect(result.blockedReason).toBe("no target");
    expect(result.remaining).toHaveLength(1);
  });

  it("suspends on first suspended step and returns remaining", () => {
    const runtime = mockRuntime({ status: "suspended" });
    const steps: CoreEffectNode[] = [
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c1" },
        key: "x",
        value: { kind: "literal", value: 1 },
      },
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c2" },
        key: "y",
        value: { kind: "literal", value: 2 },
      },
    ];
    const result = runSequence(steps, runtime, "ctx");
    expect(result.status).toBe("suspended");
    expect(result.remaining).toHaveLength(1);
  });
});

// ── runParallel ──────────────────────────────────────────────────────────────

describe("runParallel", () => {
  it("runs all steps and returns resolved", () => {
    const runtime = mockRuntime();
    const steps: CoreEffectNode[] = [
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c1" },
        key: "x",
        value: { kind: "literal", value: 1 },
      },
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c2" },
        key: "y",
        value: { kind: "literal", value: 2 },
      },
    ];
    const result = runParallel(steps, runtime, "ctx");
    expect(result.status).toBe("resolved");
    expect(runtime.apply).toHaveBeenCalledTimes(2);
  });

  it("blocks if any step blocks", () => {
    const runtime = mockRuntime({ status: "blocked", blockedReason: "illegal" });
    const steps: CoreEffectNode[] = [
      {
        op: "meta.set",
        target: { kind: "resolved", id: "c1" },
        key: "x",
        value: { kind: "literal", value: 1 },
      },
    ];
    const result = runParallel(steps, runtime, "ctx");
    expect(result.status).toBe("blocked");
  });
});

// ── runConditional ───────────────────────────────────────────────────────────

describe("runConditional", () => {
  it("runs then branch when condition is true", () => {
    const runtime = mockRuntime();
    const thenBranch: CoreEffectNode = {
      op: "meta.set",
      target: { kind: "resolved", id: "c1" },
      key: "x",
      value: { kind: "literal", value: 1 },
    };
    const result = runConditional(true, thenBranch, undefined, runtime, "ctx");
    expect(result.status).toBe("resolved");
    expect(runtime.apply).toHaveBeenCalledTimes(1);
  });

  it("runs otherwise branch when condition is false", () => {
    const runtime = mockRuntime();
    const otherwiseBranch: CoreEffectNode = {
      op: "meta.set",
      target: { kind: "resolved", id: "c1" },
      key: "x",
      value: { kind: "literal", value: 1 },
    };
    const result = runConditional(
      false,
      { op: "sequence", steps: [] },
      otherwiseBranch,
      runtime,
      "ctx",
    );
    expect(result.status).toBe("resolved");
    expect(runtime.apply).toHaveBeenCalledTimes(1);
  });

  it("resolves when condition is false and no otherwise", () => {
    const runtime = mockRuntime();
    const result = runConditional(false, { op: "sequence", steps: [] }, undefined, runtime, "ctx");
    expect(result.status).toBe("resolved");
    expect(runtime.apply).not.toHaveBeenCalled();
  });
});

// ── runRepeat ────────────────────────────────────────────────────────────────

describe("runRepeat", () => {
  it("runs step N times", () => {
    const runtime = mockRuntime();
    const step: CoreEffectNode = {
      op: "meta.set",
      target: { kind: "resolved", id: "c1" },
      key: "x",
      value: { kind: "literal", value: 1 },
    };
    const result = runRepeat(3, step, runtime, "ctx");
    expect(result.status).toBe("resolved");
    expect(runtime.apply).toHaveBeenCalledTimes(3);
  });
});

// ── suspendForChoice ─────────────────────────────────────────────────────────

describe("suspendForChoice", () => {
  it("returns suspended with remaining then branch", () => {
    const then: CoreEffectNode = { op: "sequence", steps: [] };
    const result = suspendForChoice(
      { id: "p1", target: { kind: "resolved", id: "c1" }, min: 1, max: 1 },
      then,
    );
    expect(result.status).toBe("suspended");
    expect(result.remaining).toEqual([then]);
  });
});

// ── runEffectNode ────────────────────────────────────────────────────────────

describe("runEffectNode", () => {
  it("dispatches sequence to runSequence", () => {
    const runtime = mockRuntime();
    const node: CoreEffectNode = {
      op: "sequence",
      steps: [
        {
          op: "meta.set",
          target: { kind: "resolved", id: "c1" },
          key: "x",
          value: { kind: "literal", value: 1 },
        },
      ],
    };
    const result = runEffectNode(node, runtime, "ctx");
    expect(result.status).toBe("resolved");
    expect(runtime.apply).toHaveBeenCalledTimes(1);
  });

  it("dispatches primitive actions to runtime.apply", () => {
    const runtime = mockRuntime();
    const node: CoreEffectNode = {
      op: "meta.adjustNumber",
      target: { kind: "resolved", id: "c1" },
      key: "damage",
      amount: { kind: "literal", value: 3 },
    };
    const result = runEffectNode(node, runtime, "ctx");
    expect(result.status).toBe("resolved");
    expect(runtime.apply).toHaveBeenCalledWith(node, "ctx");
  });

  it("blocks unevaluated when nodes", () => {
    const runtime = mockRuntime();
    const node: CoreEffectNode = {
      op: "when",
      condition: { type: "turn", player: "friendly" },
      // eslint-disable-next-line unicorn/no-thenable
      then: { op: "sequence", steps: [] },
    };
    const result = runEffectNode(node, runtime, "ctx");
    expect(result.status).toBe("blocked");
  });

  it("suspends choose nodes", () => {
    const runtime = mockRuntime();
    const thenNode: CoreEffectNode = { op: "sequence", steps: [] };
    const node: CoreEffectNode = {
      op: "choose",
      prompt: { id: "p1", target: { kind: "resolved", id: "c1" }, min: 1, max: 1 },
      // eslint-disable-next-line unicorn/no-thenable
      then: thenNode,
    };
    const result = runEffectNode(node, runtime, "ctx");
    expect(result.status).toBe("suspended");
    expect(result.remaining).toEqual([thenNode]);
  });

  it("suspends optional nodes", () => {
    const runtime = mockRuntime();
    const thenNode: CoreEffectNode = { op: "sequence", steps: [] };
    const node: CoreEffectNode = {
      op: "optional",
      prompt: { id: "p1", target: { kind: "resolved", id: "c1" }, min: 0, max: 1 },
      // eslint-disable-next-line unicorn/no-thenable
      then: thenNode,
    };
    const result = runEffectNode(node, runtime, "ctx");
    expect(result.status).toBe("suspended");
    expect(result.remaining).toEqual([thenNode]);
  });
});
