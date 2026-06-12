/**
 * EffectCondition — multi-trait `hasTrait` primitive (string | string[]).
 *
 * Covers the trait-OR precondition used by cards like Big Zam ("10 or more
 * (Zeon)/(Neo Zeon) Unit cards in your trash"), Hyakuri, and McGillis Fareed.
 * String = exact single-trait match (baseline). Array = OR across traits.
 * Empty array = matches nothing (we do NOT treat it as "any trait").
 */

import { describe, expect, it } from "vite-plus/test";
import type { EffectCondition } from "@tcg/gundam-types";
import { evaluateCondition } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  buildTargetResolutionContext,
  createMockUnit,
} from "../index.ts";

function setup(opts: {
  play?: ReturnType<typeof createMockUnit>[];
  trash?: ReturnType<typeof createMockUnit>[];
}) {
  const engine = GundamTestEngine.create(
    { play: opts.play ?? [], trash: opts.trash ?? [] },
    { play: [] },
  );
  const runtime = engine.getRuntime();
  const framework = runtime.getFrameworkReadAPI();
  const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework);
  return { engine, ctx };
}

describe("EffectCondition.unitCount — hasTrait predicate", () => {
  it("matches baseline: hasTrait as a single string (exact trait)", () => {
    const { ctx } = setup({
      play: [
        createMockUnit({ name: "Zaku", traits: ["zeon"] }),
        createMockUnit({ name: "GM", traits: ["earth federation"] }),
      ],
    });
    const cond: EffectCondition = {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: "zeon",
    };
    expect(evaluateCondition(cond, ctx)).toBe(true);
    expect(evaluateCondition({ ...cond, hasTrait: "neo zeon" } as EffectCondition, ctx)).toBe(
      false,
    );
  });

  it("matches array (OR) when any listed trait is present on any unit", () => {
    const { ctx } = setup({
      play: [
        createMockUnit({ name: "Sazabi", traits: ["neo zeon"] }),
        createMockUnit({ name: "GM", traits: ["earth federation"] }),
      ],
    });
    const cond: EffectCondition = {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 2,
      hasTrait: ["zeon", "neo zeon"],
    };
    // Only one of two units matches — gte 2 fails.
    expect(evaluateCondition(cond, ctx)).toBe(false);
    // gte 1 satisfied by the neo-zeon unit via OR.
    expect(evaluateCondition({ ...cond, count: 1 } as EffectCondition, ctx)).toBe(true);
  });

  it("counts across disjuncts (big-zam-style: Zeon OR Neo Zeon units)", () => {
    const { ctx } = setup({
      play: [
        createMockUnit({ name: "Zaku", traits: ["zeon"] }),
        createMockUnit({ name: "Sazabi", traits: ["neo zeon"] }),
        createMockUnit({ name: "Geara Doga", traits: ["neo zeon"] }),
      ],
    });
    const cond: EffectCondition = {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 3,
      hasTrait: ["zeon", "neo zeon"],
    };
    expect(evaluateCondition(cond, ctx)).toBe(true);
  });

  it("empty array matches nothing (no false positives)", () => {
    const { ctx } = setup({
      play: [createMockUnit({ name: "Zaku", traits: ["zeon"] })],
    });
    const cond: EffectCondition = {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: [],
    };
    expect(evaluateCondition(cond, ctx)).toBe(false);
  });

  it("single-element array behaves like the string form", () => {
    const { ctx } = setup({
      play: [createMockUnit({ name: "Zaku", traits: ["zeon"] })],
    });
    const asString: EffectCondition = {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: "zeon",
    };
    const asArray: EffectCondition = { ...asString, hasTrait: ["zeon"] };
    expect(evaluateCondition(asString, ctx)).toBe(evaluateCondition(asArray, ctx));
    expect(evaluateCondition(asArray, ctx)).toBe(true);
  });

  it("trait match is case-insensitive for both forms", () => {
    const { ctx } = setup({
      play: [createMockUnit({ name: "Zaku", traits: ["Zeon"] })],
    });
    expect(
      evaluateCondition(
        {
          type: "unitCount",
          owner: "friendly",
          comparison: "gte",
          count: 1,
          hasTrait: "ZEON",
        },
        ctx,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        {
          type: "unitCount",
          owner: "friendly",
          comparison: "gte",
          count: 1,
          hasTrait: ["NEO ZEON", "ZEON"],
        },
        ctx,
      ),
    ).toBe(true);
  });
});

describe("EffectCondition.cardInZone — hasTrait predicate", () => {
  it("matches array across disjuncts (hyakuri-style: Teiwaz OR Tekkadan in trash)", () => {
    const { ctx } = setup({
      trash: [
        createMockUnit({ name: "Barbatos", traits: ["tekkadan"] }),
        createMockUnit({ name: "Hyakuri", traits: ["teiwaz"] }),
        createMockUnit({ name: "Kimaris", traits: ["gjallarhorn"] }),
      ],
    });
    const cond: EffectCondition = {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      comparison: "gte",
      count: 2,
      hasTrait: ["teiwaz", "tekkadan"],
    };
    expect(evaluateCondition(cond, ctx)).toBe(true);
    // Third card has neither trait → gte 3 fails.
    expect(evaluateCondition({ ...cond, count: 3 } as EffectCondition, ctx)).toBe(false);
  });

  it("string form still works (baseline)", () => {
    const { ctx } = setup({
      trash: [createMockUnit({ name: "Hyakuri", traits: ["teiwaz"] })],
    });
    const cond: EffectCondition = {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      comparison: "gte",
      count: 1,
      hasTrait: "teiwaz",
    };
    expect(evaluateCondition(cond, ctx)).toBe(true);
  });

  it("can additionally filter by card color", () => {
    const { ctx } = setup({
      trash: [
        createMockUnit({ name: "Purple One", color: "purple" }),
        createMockUnit({ name: "Purple Two", color: "purple" }),
        createMockUnit({ name: "Red One", color: "red" }),
      ],
    });
    const cond: EffectCondition = {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      comparison: "gte",
      count: 2,
      hasColor: "purple",
    };

    expect(evaluateCondition(cond, ctx)).toBe(true);
    expect(evaluateCondition({ ...cond, count: 3 } as EffectCondition, ctx)).toBe(false);
  });
});
