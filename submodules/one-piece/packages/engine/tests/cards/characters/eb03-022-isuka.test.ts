import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb03Isuka022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-022 Isuka", () => {
  test("bottoms an own low-cost Character, then blocks through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Isuka022],
        character: [eb01Fourtricks025],
        activeDon: 6,
      },
      { character: [eb01Doma005, { card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownTargetId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb03Isuka022, "south");
    const returnChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(returnChoice?.kind).toBe("selectEntity");
    if (returnChoice?.kind !== "selectEntity") throw new Error("Expected Isuka's deck target.");
    expect(returnChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownTargetId,
      opposingTargetId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");
    expect(engine.getState().players.south.deck).toContain(ownTargetId);

    const isukaId = engine.findCardInZone("south", "character", eb03Isuka022);
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Isuka's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", isukaId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [isukaId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      isukaId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
