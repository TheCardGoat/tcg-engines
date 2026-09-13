import { describe, expect, it } from "vite-plus/test";
import type { FabResolvedBindings } from "./continuous/ir.ts";
import { evaluateFabRules } from "./rules-evaluator.ts";

const emptyBindings: FabResolvedBindings = { objects: {}, numbers: {}, strings: {} };

// Phase 3 of the has-status single-source-of-truth refactor. The intended
// end-state is that a declared-but-unhandled marker FAILS LOUD (throws
// FabRulesEvaluationError) rather than silently returning false. That throw is
// temporarily softened to `return false` because concurrent CR §8.5 work is
// still wiring the reached-dead markers (see the TODO in has-status.ts). These
// tests characterize the CURRENT (softened) behavior and lock the handled
// path; when the throw is restored, flip the first assertion back to .toThrow.
describe("evaluateHasStatus trapdoor", () => {
  it("throws for a string outside both closed marker lists", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const context = { controllerId: "p1", source: null, bindings: emptyBindings };
    // Required Record<FabAuthorableStatusMarker, …> makes an unhandled declared
    // marker unrepresentable. The throw is reachable only for input outside
    // both closed lists.
    expect(() =>
      view.evaluateCondition(
        { type: "has-status", status: "not-a-catalog-status-marker" as never },
        context,
      ),
    ).toThrow(/unhandled has-status/);
  });

  it("resolves the Bloodrot attacking-hero reaction marker from combat facts", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const context = { controllerId: "p1", source: null, bindings: emptyBindings };
    expect(
      view.evaluateCondition(
        {
          type: "has-status",
          status: "attacking-hero-played-or-activated-this-chain-link-reaction",
        },
        context,
      ),
    ).toBe(false);
  });

  it("still resolves a handled marker (fused with no source → false)", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const context = { controllerId: "p1", source: null, bindings: emptyBindings };
    expect(view.evaluateCondition({ type: "has-status", status: "fused" }, context)).toBe(false);
  });

  it("reads the pitched-this-way-lightning-card numeric binding (symmetric with Earth/Ice)", () => {
    // The Lightning elemental-pitch stamp is produced (activation payment +
    // play finalize) and consumed through binding-numeric like its Earth/Ice
    // siblings.
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const stamped = {
      controllerId: "p1",
      source: null,
      bindings: {
        ...emptyBindings,
        numbers: { "pitched-this-way-lightning-card": 1 },
      },
    };
    expect(
      view.evaluateCondition(
        {
          type: "binding-numeric",
          binding: "pitched-this-way-lightning-card",
          comparison: { op: "eq", value: 1 },
        },
        stamped,
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "binding-numeric",
          binding: "pitched-this-way-lightning-card",
          comparison: { op: "eq", value: 1 },
        },
        { controllerId: "p1", source: null, bindings: emptyBindings },
      ),
    ).toBe(false);
  });
});
