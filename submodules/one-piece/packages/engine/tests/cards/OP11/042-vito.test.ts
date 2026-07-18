import { describe, expect, test } from "vite-plus/test";
import { op11Vito042 } from "../../../../cards/src/cards/OP11/characters/042-vito.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP11-042 Vito", () => {
  test("trashes a Firetank Pirates card to gain Rush for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Vito042, op11Vito042, op11Vito042, op14eb04Killer005],
        activeDon: op11Vito042.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardVitoIds = engine
      .getState()
      .players.south.hand.filter(
        (instanceId) => engine.getState().cards[instanceId]?.cardId === op11Vito042.id,
      )
      .slice(1);
    const discardVitoId = discardVitoIds[0]!;
    const killerId = engine.findCardInZone("south", "hand", op14eb04Killer005);

    engine.playCard(op11Vito042);
    const playedVitoId = engine.findCardInZone("south", "character", op11Vito042);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectOptional")!.id,
      optionId: "yes",
    });
    const costPrompt = pendingPrompt(engine, "effectCostTrashFromHand");
    expect(costPrompt!.options.map((option) => option.targetId)).toEqual(discardVitoIds);
    expect(costPrompt!.options.some((option) => option.targetId === killerId)).toBe(false);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: costPrompt!.id,
      selectedIds: [discardVitoId],
    });

    engine.declareAttack(playedVitoId, engine.leader("north"));

    expect(engine.findCardInZone("south", "trash", op11Vito042)).toBe(discardVitoId);
    expect(engine.findCardInZone("south", "hand", op14eb04Killer005)).toBe(killerId);
    expect(engine.getState().cards[playedVitoId]?.rested).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
