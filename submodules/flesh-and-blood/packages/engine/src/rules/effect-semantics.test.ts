import { describe, expect, it } from "vite-plus/test";
import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { FAB_EFFECT_TYPES } from "./keyword-effect-inventory.ts";
import {
  FAB_EFFECT_SEMANTICS_BY_TYPE,
  effectSemanticKind,
  type FabEffectSemanticKind,
} from "./effect-semantics.ts";

describe("effect semantics completeness", () => {
  it("classifies every effect discriminant exactly once", () => {
    expect(Object.keys(FAB_EFFECT_SEMANTICS_BY_TYPE).sort()).toEqual([...FAB_EFFECT_TYPES].sort());
  });

  it("keeps duration-bearing evaluator inputs out of direct-mutation semantics", () => {
    for (const type of [
      "copy",
      "gain-control",
      "become",
      "freeze",
      "modify-numeric",
      "modify-activation-cost",
      "grant-property",
      "remove-property",
      "can-be-attacked",
      "play-card",
      "rule-modification",
    ] as const) {
      expect(FAB_EFFECT_SEMANTICS_BY_TYPE[type]).toBe("continuous-effect-producer");
    }
  });

  it("has no permissive unclassified fallback", () => {
    const kinds = new Set<FabEffectSemanticKind>(Object.values(FAB_EFFECT_SEMANTICS_BY_TYPE));
    expect(kinds.has("explicit-unsupported-mechanic")).toBe(false);
    const draw: Extract<FabEffect, { readonly type: "draw" }> = {
      type: "draw",
      count: 1,
      player: "controller",
    };
    expect(effectSemanticKind(draw)).toBe("discrete-event-producer");
  });
});
