import { describe, expect, test } from "vite-plus/test";
import { op02Sakazuki099 } from "../../../../cards/src/cards/OP02/characters/099-sakazuki.ts";
import { op12DonquixoteRosinante048 } from "../../../../cards/src/cards/OP12/characters/048-donquixote-rosinante.ts";
import { op12Hina051 } from "../../../../cards/src/cards/OP12/characters/051-hina.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP12-048 Donquixote Rosinante", () => {
  test("rests itself and trashes a hand card to replace removal of a blue Navy Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12DonquixoteRosinante048, op12Hina051],
        hand: [op14eb04Killer005],
      },
      {
        hand: [op02Sakazuki099, op14eb04Killer005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op12DonquixoteRosinante048);
    const hinaId = engine.findCardInZone("south", "character", op12Hina051);
    const paymentId = engine.findCardInZone("south", "hand", op14eb04Killer005);

    engine.playCard(op02Sakazuki099, "north");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectOptional")!.id,
      optionId: "yes",
    });
    const costPrompt = pendingPrompt(engine, "effectCostTrashFromHand");
    if (costPrompt) {
      engine.exec({
        type: "resolvePrompt",
        seat: "north",
        promptId: costPrompt.id,
        selectedIds: [engine.findCardInZone("north", "hand", op14eb04Killer005)],
      });
    }
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [hinaId],
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectKoReplacement")!.id,
      optionId: "yes",
    });

    expect(engine.findCardInZone("south", "character", op12Hina051)).toBe(hinaId);
    expect(engine.getState().cards[rosinanteId]?.rested).toBe(true);
    expect(engine.findCardInZone("south", "trash", op14eb04Killer005)).toBe(paymentId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
