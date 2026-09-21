import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op17RocksDXebec118 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const FILLER_A = "OP16-096";
const FILLER_B = "OP16-095";

describe("OP17-039 Rocks.D.Xebec", () => {
  test("trashing a hand card on attack reveals the top deck card and draws 2 for {Rocks Pirates}", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        hand: [FILLER_A, FILLER_B],
        deck: [op17RocksDXebec118, FILLER_A, FILLER_B],
        activeDon: 5,
      },
      {},
    );
    const trashBefore = engine.getView("south").players.south.trash.length;
    const trashId = engine.findCardInZone("south", "hand", FILLER_A);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected the hand-trash cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [trashId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash).toHaveLength(trashBefore + 1);
    expect(view.trash.map((card) => card.instanceId)).toContain(trashId);
    expect(view.hand.map((card) => card.cardId)).toContain(op17RocksDXebec118.id);
    expect(view.hand).toHaveLength(3);
    expect(view.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("revealing a non-{Rocks Pirates} card draws nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        hand: [FILLER_A, FILLER_B],
        deck: [eb01Doma005, FILLER_A, FILLER_B],
        activeDon: 5,
      },
      {},
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [engine.findCardInZone("south", "hand", FILLER_A)] },
      "south",
    );

    const view = engine.getView("south").players.south;
    expect(view.hand).toHaveLength(1);
    expect(view.deckCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining leaves hand and deck untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        hand: [FILLER_A, FILLER_B],
        deck: [op17RocksDXebec118, FILLER_A, FILLER_B],
        activeDon: 5,
      },
      {},
    );
    const before = engine.getView("south").players.south;

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const after = engine.getView("south").players.south;
    expect(after.hand).toHaveLength(before.hand.length);
    expect(after.deckCount).toBe(before.deckCount);
    expect(after.trash).toHaveLength(before.trash.length);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
