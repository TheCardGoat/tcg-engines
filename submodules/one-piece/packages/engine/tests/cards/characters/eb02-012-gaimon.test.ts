import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb02Gaimon012, eb02Sarfunkel014 } from "@tcg/op-cards";

import { getCard } from "../../../../cards/src/runtime-catalog.ts";

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
  test("the name may be on a Leader (synthetic named-Leader boundary)", () => {
    // The current catalog has no Leader with this name; restore the fixture metadata.
    const leader = getCard("OP01-001");
    const originalNames = leader.alternateNames;
    leader.alternateNames = [...(originalNames ?? []), "Sarfunkel"];
    try {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "OP01-001", character: ["EB02-012"] },
        {},
        { activeSeat: "north" },
      );
      const blockerId = engine.findCardInZone("south", "character", "EB02-012");
      const life = engine.getView("south").players.south.lifeCount;
      engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
      const step = engine.pendingDecision("battleBlocker", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected named-field Blocker");
      expect(
        step.candidates
          .filter((candidate) => candidate.ref.kind === "card")
          .map((candidate) => candidate.ref.id),
      ).toEqual([blockerId]);
      engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
      expect(engine.getView("south").players.south.lifeCount).toBe(life);
      expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
        blockerId,
      );
    } finally {
      if (originalNames === undefined) delete leader.alternateNames;
      else leader.alternateNames = originalNames;
    }
  });
});
