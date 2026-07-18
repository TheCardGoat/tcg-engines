import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op09Shiryu088 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-088 Shiryu", () => {
  test("with DON!! x1 may trash two selected hand cards to draw two", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09Shiryu088, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shiryuId = engine.findCardInZone("south", "character", op09Shiryu088);
    const firstCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const retainedId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);

    engine.attachDon(shiryuId, 1, "south");
    engine.declareAttack(shiryuId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2 });
    if (cost?.kind !== "payCost") throw new Error("Expected Shiryu's two-card hand cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstCostId,
      secondCostId,
      retainedId,
    ]);
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [firstCostId, secondCostId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstCostId, secondCostId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([retainedId, ...drawnIds]),
    );
    expect(view.players.south.handCount).toBe(3);
  });

  test("without attached DON!! does not offer the hand cost or draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09Shiryu088, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shiryuId = engine.findCardInZone("south", "character", op09Shiryu088);

    engine.declareAttack(shiryuId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 2, deckCount: 2 });
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
  });
});
