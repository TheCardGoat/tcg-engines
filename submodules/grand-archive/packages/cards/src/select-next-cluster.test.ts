import { describe, expect, it } from "vitest";

import {
  selectNextGrandArchiveGapCluster,
  type GrandArchiveGapFamily,
} from "../scripts/card-coverage/select-next-cluster.ts";

function gap(
  family: string,
  members: readonly string[],
  options: Partial<GrandArchiveGapFamily> = {},
): GrandArchiveGapFamily {
  return {
    family,
    kind: "engine-primitive",
    primitive: null,
    status: "open",
    repro: family,
    members: members.map((canonicalId) => ({ canonicalId, abilityIds: [`${canonicalId}-a1`] })),
    ...options,
  };
}

describe("selectNextGrandArchiveGapCluster", () => {
  it("selects the densest open family", () => {
    const selected = selectNextGrandArchiveGapCluster([
      gap("effects/draw", ["a"]),
      gap("effects/move", ["b", "c"]),
    ]);
    expect(selected.families).toEqual(["effects/move"]);
  });

  it("clusters families with the same concrete engine owner", () => {
    const selected = selectNextGrandArchiveGapCluster(
      [
        gap("effects/draw", ["a"], { primitive: "src/procedures/effects/effect-executor.ts" }),
        gap("effects/mill", ["b"], { primitive: "src/procedures/effects/effect-executor.ts" }),
      ],
      "effects/draw",
    );
    expect(selected.families).toEqual(["effects/draw", "effects/mill"]);
    expect(selected.canonicalIds).toEqual(["a", "b"]);
  });

  it("ignores resolved and out-of-scope families", () => {
    const selected = selectNextGrandArchiveGapCluster([
      gap("resolved", ["a"], { status: "resolved" }),
      gap("multiplayer", ["b"], { kind: "out-of-scope" }),
    ]);
    expect(selected.families).toEqual([]);
  });
});
