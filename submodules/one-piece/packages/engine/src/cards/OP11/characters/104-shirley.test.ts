import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11Ishilly025, op11Shirley104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-104 Shirley", () => {
  test("turns top Life face-down, finds an included Fish-Man Island card, and puts the ordered remainder on top", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Shirley104],
      life: [{ card: eb01Doma005, faceUp: true }],
      deck: [op11Ishilly025, eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op11Shirley104.cost,
    });
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const chosenId = engine.findCardInZone("south", "deck", op11Ishilly025);
    const excludedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op11Shirley104, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Shirley's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === chosenId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [chosenId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Shirley's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "top" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(chosenId);
    expect(engine.getState().cards[lifeId]?.faceUp).toBe(false);
    expect(engine.getState().players.south.deck.slice(0, 2)).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });

  test("is a legal Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Shirley104] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shirleyId = engine.findCardInZone("south", "character", op11Shirley104);

    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shirley's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shirleyId);
  });
});
