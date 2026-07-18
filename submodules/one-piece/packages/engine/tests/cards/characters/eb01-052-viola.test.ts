import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Viola052 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-052 Viola", () => {
  test("privately reorders every opposing Life card without changing face state, then blocks", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01Viola052], activeDon: 2 },
      {
        life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }, eb01Fourtricks025],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const originalLife = [...engine.getState().players.north.life];
    const originalFaceStates = originalLife.map((id) => engine.getState().cards[id]!.faceUp);

    engine.playCard(eb01Viola052);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const order = engine.pendingDecision("effectRearrangeLifeOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") {
      throw new Error("Expected Viola's controller to order the opposing Life cards.");
    }
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(originalLife);
    engine.resolveDecision(
      "effectRearrangeLifeOrder",
      { selectedIds: [...originalLife].reverse() },
      "south",
    );

    expect(engine.getState().players.north.life).toEqual([...originalLife].reverse());
    expect(originalLife.map((id) => engine.getState().cards[id]!.faceUp)).toEqual(
      originalFaceStates,
    );

    const violaId = engine.findCardInZone("south", "character", eb01Viola052);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") {
      throw new Error("Expected Viola's Blocker choice.");
    }
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", violaId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [violaId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      violaId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("turns all of its controller's Life cards face-down without reordering them", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01Viola052],
      activeDon: 2,
      life: [
        { card: eb01Doma005, faceUp: true, publicKnowledge: true },
        { card: eb01Fourtricks025, faceUp: true, publicKnowledge: true },
      ],
    });
    const originalLife = [...engine.getState().players.south.life];

    engine.playCard(eb01Viola052);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    expect(engine.getState().players.south.life).toEqual(originalLife);
    expect(originalLife.map((id) => engine.getState().cards[id]!.faceUp)).toEqual([false, false]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
