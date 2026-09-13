import { describe, expect, it } from "vite-plus/test";
import { evaluateCompareAmount } from "./compare-amount.ts";
import type { FabEvalContext } from "../../rules-view.ts";

describe("compare-amount", () => {
  it("compares a literal amount through evaluateAmount", () => {
    const context = {
      controllerId: "p1",
      bindings: { numbers: {}, objects: {}, strings: {} },
    } as FabEvalContext;
    expect(
      evaluateCompareAmount(
        {
          type: "compare-amount",
          amount: 4,
          comparison: { op: "gte", value: 2 },
        },
        context,
        new Map(),
      ),
    ).toBe(true);
    expect(
      evaluateCompareAmount(
        {
          type: "compare-amount",
          amount: 1,
          comparison: { op: "gte", value: 2 },
        },
        context,
        new Map(),
      ),
    ).toBe(false);
  });

  it("compares a chain-link count through evaluateAmount", () => {
    const context = {
      controllerId: "p1",
      source: { instanceId: "src", incarnation: 0 },
      bindings: { numbers: {}, objects: {}, strings: {} },
      facts: {
        playerDraconicChainLinks: { p1: 3, p2: 0 },
        combat: { chainLinkNumber: 3 },
      },
    } as unknown as FabEvalContext;
    expect(
      evaluateCompareAmount(
        {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "chain-links",
            player: "controller",
            filter: { typeBox: { supertypes: ["Draconic"] } },
          },
          comparison: { op: "gte", value: 2 },
        },
        context,
        new Map(),
      ),
    ).toBe(true);
    expect(
      evaluateCompareAmount(
        {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "chain-links",
            player: "controller",
            filter: { typeBox: { supertypes: ["Draconic"] } },
          },
          comparison: { op: "gte", value: 4 },
        },
        context,
        new Map(),
      ),
    ).toBe(false);
  });
});
