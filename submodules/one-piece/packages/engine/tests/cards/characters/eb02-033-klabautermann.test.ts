import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, eb02Klabautermann033, eb02MerryGo041 } from "@tcg/op-cards";

import { getCard } from "../../../../cards/src/runtime-catalog.ts";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-033 Klabautermann", () => {
  test("gains Blocker only while its controller has Merry Go", () => {
    const createEngine = (withMerryGo: boolean) =>
      OnePieceTestEngine.create(
        {
          character: [eb02Klabautermann033],
          ...(withMerryGo ? { stage: eb02MerryGo041 } : {}),
        },
        {
          character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        },
        { firstPlayer: "south", activeSeat: "north" },
      );

    const unavailable = createEngine(false);
    const unavailableAttackerId = unavailable.findCardInZone(
      "north",
      "character",
      eb01MountainGod018,
    );
    const lifeBefore = unavailable.getView("south").players.south.lifeCount;
    unavailable.declareAttack(unavailableAttackerId, unavailable.leader("south"), "north");
    expect(unavailable.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
    expect(unavailable.getView("south").prompts).toHaveLength(0);

    const engine = createEngine(true);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const blockerId = engine.findCardInZone("south", "character", eb02Klabautermann033);
    const protectedLife = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Klabautermann's Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", blockerId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(protectedLife);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      blockerId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("the name may be on a Leader (synthetic named-Leader boundary)", () => {
    // The current catalog has no Leader with this name; restore the fixture metadata.
    const leader = getCard("OP01-001");
    const originalNames = leader.alternateNames;
    leader.alternateNames = [...(originalNames ?? []), "Merry Go"];
    try {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "OP01-001", character: ["EB02-033"] },
        {},
        { activeSeat: "north" },
      );
      const blockerId = engine.findCardInZone("south", "character", "EB02-033");
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
