import { describe, expect, test } from "vite-plus/test";
import { op01Nekomamushi048 } from "../../../../cards/src/cards/OP01/characters/048-nekomamushi.ts";
import { op01XDrake054 } from "../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { op13Koala081 } from "../../../../cards/src/cards/OP13/characters/081-koala.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP13-081 Koala", () => {
  test("places a chosen trash card at deck bottom before giving a rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13Koala081],
        trash: [op01Nekomamushi048, op01XDrake054],
        deck: [op01XDrake054],
        restedDon: 1,
      },
      {},
      { firstPlayer: "south", activeSeat: "south" },
    );
    const koalaId = engine.findCardInZone("south", "character", op13Koala081);
    const nekomamushiId = engine.findCardInZone("south", "trash", op01Nekomamushi048);

    engine.activateEffect(koalaId, "activateMain");
    const optionalPrompt = pendingPrompt(engine, "effectOptional");
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });

    const costPrompt = pendingPrompt(engine, "effectCostReturnTrashToDeck");
    expect(costPrompt?.options.map((option) => option.targetId)).toContain(nekomamushiId);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: costPrompt!.id,
      selectedIds: [nekomamushiId],
    });

    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectGiveDonCount")!.id,
      optionId: "1",
    });
    const giveDonPrompt = pendingPrompt(engine, "effectTargetSelection");
    const leaderId = engine.leader("south");
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: giveDonPrompt!.id,
      selectedIds: [leaderId],
    });

    const state = engine.getState();
    expect(state.players.south.deck.at(-1)).toBe(nekomamushiId);
    expect(state.cards[leaderId]?.attachedDon).toBe(1);
    expect(state.players.south.restedDon).toBe(0);
    expect(state.capabilityHistory).toEqual([]);
  });
});
