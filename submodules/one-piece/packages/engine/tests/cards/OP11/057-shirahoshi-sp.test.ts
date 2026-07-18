import { describe, expect, test } from "vite-plus/test";
import { eb01Shirahoshi057 } from "../../../../cards/src/cards/EB01/characters/057-shirahoshi.ts";
import { op13Higuma013 } from "../../../../cards/src/cards/OP13/characters/013-higuma.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("EB01-057 Shirahoshi (OP11 SP)", () => {
  test("adds the top deck card to Life when K.O.'d by an opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb01Shirahoshi057],
        deck: [
          op14eb04Killer005,
          op14eb04Killer005,
          op14eb04Killer005,
          op14eb04Killer005,
          op14eb04Killer005,
        ],
        life: 0,
      },
      {
        hand: [op13Higuma013],
        activeDon: op13Higuma013.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shirahoshiId = engine.findCardInZone("south", "character", eb01Shirahoshi057);

    engine.playCard(op13Higuma013, "north");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [shirahoshiId],
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectAddToLifeFromDeck")!.id,
      optionId: "1",
    });

    expect(engine.findCardInZone("south", "trash", eb01Shirahoshi057)).toBe(shirahoshiId);
    expect(engine.getState().players.south.life).toHaveLength(1);
    expect(engine.getState().players.south.deck).toHaveLength(4);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
