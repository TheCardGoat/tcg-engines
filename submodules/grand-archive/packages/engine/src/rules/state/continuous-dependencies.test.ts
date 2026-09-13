import type { GrandArchiveContinuousEffect } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchiveContinuousApplicationLayer,
  grandArchiveContinuousDependencyLayers,
  grandArchiveContinuousHasLayerDependency,
} from "./continuous-dependencies.ts";

function typeEffect(
  overrides: Partial<GrandArchiveContinuousEffect> = {},
): GrandArchiveContinuousEffect {
  return {
    kind: "continuous",
    subjects: { kind: "bound", binding: "target" },
    affectedSet: "locked",
    duration: { kind: "permanent" },
    layer: { layer: "B", modifies: "type" },
    change: {
      kind: "add-characteristic",
      characteristic: { kind: "type", value: "ALLY" },
    },
    ...overrides,
  };
}

describe("Grand Archive continuous-effect dependency analysis", () => {
  it("promotes a Layer B effect whose condition reads Layer C", () => {
    const effect = typeEffect({
      condition: {
        kind: "subject-matches",
        subject: { kind: "bound", binding: "target" },
        filter: { kind: "element", oneOf: ["FIRE"] },
      },
    });

    expect(grandArchiveContinuousDependencyLayers(effect)).toEqual(["C"]);
    expect(grandArchiveContinuousApplicationLayer(effect)).toBe("C");
    expect(grandArchiveContinuousHasLayerDependency(effect)).toBe(true);
  });

  it("finds dependencies nested in subjects, conditions, filters, and amounts", () => {
    const effect: GrandArchiveContinuousEffect = {
      kind: "continuous",
      subjects: {
        kind: "each",
        collection: {
          zones: ["field"],
          filter: {
            kind: "all",
            filters: [
              { kind: "type", oneOf: ["ALLY"] },
              { kind: "element", oneOf: ["FIRE"] },
              { kind: "has-keyword", keyword: "taunt" },
            ],
          },
        },
      },
      affectedSet: "dynamic",
      condition: {
        kind: "compare",
        comparison: {
          left: {
            kind: "property",
            subject: { kind: "candidate" },
            property: "power",
            basis: "current",
          },
          operator: "gt",
          right: 0,
        },
      },
      duration: { kind: "permanent" },
      layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
      change: {
        kind: "numeric",
        property: "power",
        operation: "add",
        amount: {
          kind: "count",
          collection: {
            zones: ["field"],
            filter: { kind: "subtype", oneOf: ["SPIRIT"] },
          },
          distinctBy: "reserve-cost",
        },
      },
    };

    expect(grandArchiveContinuousDependencyLayers(effect)).toEqual(["A", "B", "C", "D", "E"]);
    expect(grandArchiveContinuousApplicationLayer(effect)).toBe("E");
    expect(grandArchiveContinuousHasLayerDependency(effect)).toBe(true);
  });

  it("distinguishes a pure grant from changes that inspect existing Layer D abilities", () => {
    const grant: GrandArchiveContinuousEffect = {
      kind: "continuous",
      subjects: { kind: "bound", binding: "target" },
      affectedSet: "locked",
      duration: { kind: "permanent" },
      layer: { layer: "D", modifies: "ability" },
      change: {
        kind: "grant-ability",
        ability: {
          id: "dependency-a1",
          text: "Taunt",
          kind: "static",
          staticKind: "intrinsic",
          keyword: { name: "taunt" },
        },
      },
    };
    const remove: GrandArchiveContinuousEffect = {
      ...grant,
      change: { kind: "remove-abilities" },
    };

    expect(grandArchiveContinuousDependencyLayers(grant)).toEqual([]);
    expect(grandArchiveContinuousHasLayerDependency(grant)).toBe(false);
    expect(grandArchiveContinuousDependencyLayers(remove)).toEqual(["D"]);
    expect(grandArchiveContinuousHasLayerDependency(remove)).toBe(true);
  });

  it("uses timestamp ordering for an effect with no derived-state dependency", () => {
    const effect = typeEffect();

    expect(grandArchiveContinuousDependencyLayers(effect)).toEqual([]);
    expect(grandArchiveContinuousApplicationLayer(effect)).toBe("B");
    expect(grandArchiveContinuousHasLayerDependency(effect)).toBe(false);
  });
});
