import { describe, expect, test } from "vite-plus/test";
import { op01Nekomamushi048 } from "../../../../cards/src/cards/OP01/characters/048-nekomamushi.ts";
import { op13JewelryBonney109 } from "../../../../cards/src/cards/OP13/characters/109-jewelry-bonney.ts";
import { op14eb04Shiryu048 } from "../../../../cards/src/cards/OP14EB04/characters/048-shiryu.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP13-109 Jewelry Bonney", () => {
  test("turns the top Life card face-up instead of being returned by an opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [op01Nekomamushi048],
        character: [op13JewelryBonney109],
      },
      {
        hand: [op14eb04Shiryu048],
        activeDon: 10,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonneyId = engine.findCardInZone("south", "character", op13JewelryBonney109);
    const lifeId = engine.findCardInZone("south", "life", op01Nekomamushi048);

    engine.playCard(op14eb04Shiryu048, "north");
    const targetPrompt = pendingPrompt(engine, "effectTargetSelection");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: targetPrompt!.id,
      selectedIds: [bonneyId],
    });

    const replacementPrompt = pendingPrompt(engine, "effectRemovalReplacement");
    expect(replacementPrompt).toBeDefined();
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: replacementPrompt!.id,
      optionId: "yes",
    });

    expect(engine.findCardInZone("south", "character", op13JewelryBonney109)).toBe(bonneyId);
    expect(engine.getState().cards[lifeId]?.faceUp).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });

  test("cannot replace removal when the top Life card is already face-up", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [{ card: op01Nekomamushi048, faceUp: true }],
        character: [op13JewelryBonney109],
      },
      {
        hand: [op14eb04Shiryu048],
        activeDon: 10,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonneyId = engine.findCardInZone("south", "character", op13JewelryBonney109);

    engine.playCard(op14eb04Shiryu048, "north");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [bonneyId],
    });

    expect(pendingPrompt(engine, "effectRemovalReplacement")).toBeUndefined();
    expect(engine.findCardInZone("south", "hand", op13JewelryBonney109)).toBe(bonneyId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
