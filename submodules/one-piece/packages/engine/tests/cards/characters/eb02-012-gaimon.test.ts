import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb02Gaimon012, eb02Sarfunkel014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-012 Gaimon", () => {
  test("gains Blocker only while its controller has Sarfunkel", () => {
    const withoutSarfunkel = OnePieceTestEngine.create(
      { character: [eb02Gaimon012] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const firstAttackerId = withoutSarfunkel.findCardInZone("north", "character", eb01Doma005);
    withoutSarfunkel.declareAttack(firstAttackerId, withoutSarfunkel.leader("south"), "north");
    expect(withoutSarfunkel.getView("south").prompts).toHaveLength(0);

    const withSarfunkel = OnePieceTestEngine.create(
      { character: [eb02Gaimon012, eb02Sarfunkel014] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const gaimonId = withSarfunkel.findCardInZone("south", "character", eb02Gaimon012);
    const secondAttackerId = withSarfunkel.findCardInZone("north", "character", eb01Doma005);
    withSarfunkel.declareAttack(secondAttackerId, withSarfunkel.leader("south"), "north");

    const blocker = withSarfunkel.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Gaimon's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", gaimonId]);
    withSarfunkel.resolveDecision("battleBlocker", { selectedIds: [gaimonId] }, "south");
    expect(
      withSarfunkel.getView("south").players.south.trash.map((card) => card.instanceId),
    ).toContain(gaimonId);
    expect(withSarfunkel.getState().capabilityHistory).toHaveLength(0);
  });
});
