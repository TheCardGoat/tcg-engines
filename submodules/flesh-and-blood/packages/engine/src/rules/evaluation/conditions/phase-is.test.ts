import { describe, expect, it } from "vite-plus/test";

import type { FabRulesFacts } from "../../rules-view.ts";
import { evaluatePhaseIs } from "./phase-is.ts";

const facts = (phase: FabRulesFacts["phase"]): FabRulesFacts =>
  ({ activePlayerId: "p1", phase, turnNumber: 1 }) as FabRulesFacts;

const context = (phase: FabRulesFacts["phase"]) => ({
  controllerId: "p1",
  source: null,
  bindings: { objects: {}, numbers: {}, strings: {} },
  facts: facts(phase),
});

describe("evaluatePhaseIs (SEA253 'during an action phase')", () => {
  it("matches only the named phase", () => {
    expect(
      evaluatePhaseIs({ type: "phase-is", phase: "action" }, context("action"), new Map()),
    ).toBe(true);
    expect(evaluatePhaseIs({ type: "phase-is", phase: "action" }, context("end"), new Map())).toBe(
      false,
    );
    expect(
      evaluatePhaseIs({ type: "phase-is", phase: "action" }, context("start"), new Map()),
    ).toBe(false);
  });

  it("fails closed between turns (null phase matches nothing)", () => {
    expect(evaluatePhaseIs({ type: "phase-is", phase: "end" }, context(null), new Map())).toBe(
      false,
    );
  });
});
