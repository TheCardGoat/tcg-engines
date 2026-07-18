import { describe, expect, test } from "vite-plus/test";
import { op01Nekomamushi048 } from "../../../../cards/src/cards/OP01/characters/048-nekomamushi.ts";
import { op01XDrake054 } from "../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { op13TrafalgarLaw031 } from "../../../../cards/src/cards/OP13/characters/031-trafalgar-law.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP13-031 Trafalgar Law", () => {
  test("returns a chosen Character as its On Play cost before playing a rested Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13TrafalgarLaw031, op01Nekomamushi048],
        character: [op01XDrake054],
        activeDon: 10,
      },
      {},
      { firstPlayer: "south", activeSeat: "south" },
    );
    const drakeId = engine.findCardInZone("south", "character", op01XDrake054);
    const nekomamushiId = engine.findCardInZone("south", "hand", op01Nekomamushi048);

    engine.playCard(op13TrafalgarLaw031);
    const optionalPrompt = pendingPrompt(engine, "effectOptional");
    expect(optionalPrompt).toBeDefined();
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });

    const costPrompt = pendingPrompt(engine, "effectCostReturnCharacter");
    expect(costPrompt?.options.map((option) => option.targetId)).toContain(drakeId);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: costPrompt!.id,
      selectedIds: [drakeId],
    });

    const playPrompt = pendingPrompt(engine, "effectPlaySelection");
    expect(playPrompt?.options.map((option) => option.targetId)).toContain(nekomamushiId);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: playPrompt!.id,
      selectedIds: [nekomamushiId],
    });

    expect(engine.findCardInZone("south", "hand", op01XDrake054)).toBe(drakeId);
    expect(engine.findCardInZone("south", "character", op01Nekomamushi048)).toBe(nekomamushiId);
    expect(engine.getState().cards[nekomamushiId]?.rested).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
