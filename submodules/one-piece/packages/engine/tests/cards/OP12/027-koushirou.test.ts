import { describe, expect, test } from "vite-plus/test";
import { op01XDrake054 } from "../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { op02Sakazuki099 } from "../../../../cards/src/cards/OP02/characters/099-sakazuki.ts";
import { op12Koushirou027 } from "../../../../cards/src/cards/OP12/characters/027-koushirou.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

function playSakazukiAndTarget(engine: OnePieceTestEngine, targetId: string) {
  engine.playCard(op02Sakazuki099, "north");
  const optionalPrompt = pendingPrompt(engine, "effectOptional");
  engine.exec({
    type: "resolvePrompt",
    seat: "north",
    promptId: optionalPrompt!.id,
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
  const targetPrompt = pendingPrompt(engine, "effectTargetSelection");
  engine.exec({
    type: "resolvePrompt",
    seat: "north",
    promptId: targetPrompt!.id,
    selectedIds: [targetId],
  });
}

describe("OP12-027 Koushirou", () => {
  test("rests itself to replace an opponent-effect K.O. of another eligible Slash Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12Koushirou027, op01XDrake054],
      },
      {
        hand: [op02Sakazuki099, op14eb04Killer005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koushirouId = engine.findCardInZone("south", "character", op12Koushirou027);
    const drakeId = engine.findCardInZone("south", "character", op01XDrake054);

    playSakazukiAndTarget(engine, drakeId);
    const replacementPrompt = pendingPrompt(engine, "effectKoReplacement");
    expect(replacementPrompt?.sourceInstanceId).toBe(koushirouId);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: replacementPrompt!.id,
      optionId: "yes",
    });

    expect(engine.findCardInZone("south", "character", op01XDrake054)).toBe(drakeId);
    expect(engine.getState().cards[koushirouId]?.rested).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });

  test("does not replace its own K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12Koushirou027],
      },
      {
        hand: [op02Sakazuki099, op14eb04Killer005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koushirouId = engine.findCardInZone("south", "character", op12Koushirou027);

    playSakazukiAndTarget(engine, koushirouId);

    expect(pendingPrompt(engine, "effectKoReplacement")).toBeUndefined();
    expect(engine.findCardInZone("south", "trash", op12Koushirou027)).toBe(koushirouId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
