import { describe, expect, test } from "vite-plus/test";
import { eb01Shirahoshi057 } from "../../../../cards/src/cards/characters/eb01-057-shirahoshi.ts";
import { op02Sakazuki099 } from "../../../../cards/src/cards/characters/op02-099-sakazuki.ts";
import { op11Aladine024 } from "../../../../cards/src/cards/characters/op11-024-aladine.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/characters/op14-005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP11-024 Aladine", () => {
  test("pays both costs before playing a Fish-Man or Merfolk after an effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Aladine024],
        hand: [eb01Shirahoshi057, op14eb04Killer005],
        activeDon: 1,
      },
      {
        hand: [op02Sakazuki099, op14eb04Killer005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aladineId = engine.findCardInZone("south", "character", op11Aladine024);
    const shirahoshiId = engine.findCardInZone("south", "hand", eb01Shirahoshi057);
    const southDiscardId = engine.findCardInZone("south", "hand", op14eb04Killer005);

    engine.playCard(op02Sakazuki099, "north");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectOptional")!.id,
      optionId: "yes",
    });
    const northCostPrompt = pendingPrompt(engine, "effectCostTrashFromHand");
    if (northCostPrompt) {
      engine.exec({
        type: "resolvePrompt",
        seat: "north",
        promptId: northCostPrompt.id,
        selectedIds: [engine.findCardInZone("north", "hand", op14eb04Killer005)],
      });
    }
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [aladineId],
    });

    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectOptional")!.id,
      optionId: "yes",
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectCostTrashFromHand")!.id,
      selectedIds: [southDiscardId],
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectPlaySelection")!.id,
      selectedIds: [shirahoshiId],
    });

    expect(engine.findCardInZone("south", "trash", op11Aladine024)).toBe(aladineId);
    expect(engine.findCardInZone("south", "trash", op14eb04Killer005)).toBe(southDiscardId);
    expect(engine.findCardInZone("south", "character", eb01Shirahoshi057)).toBe(shirahoshiId);
    expect(engine.getState().players.south.activeDon).toBe(0);
    expect(engine.getState().players.south.restedDon).toBe(1);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Aladine024],
        hand: [eb01Shirahoshi057, op14eb04Killer005],
        activeDon: 1,
      },
      {
        hand: [op02Sakazuki099, op14eb04Killer005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aladineId = engine.findCardInZone("south", "character", op11Aladine024);
    const southDiscardId = engine.findCardInZone("south", "hand", op14eb04Killer005);
    const shirahoshiId = engine.findCardInZone("south", "hand", eb01Shirahoshi057);

    engine.playCard(op02Sakazuki099, "north");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectOptional")!.id,
      optionId: "yes",
    });
    const northCostPrompt = pendingPrompt(engine, "effectCostTrashFromHand");
    if (northCostPrompt) {
      engine.exec({
        type: "resolvePrompt",
        seat: "north",
        promptId: northCostPrompt.id,
        selectedIds: [engine.findCardInZone("north", "hand", op14eb04Killer005)],
      });
    }
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [aladineId],
    });

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    // Declined On K.O.: no rest DON!!, payment stays in hand, Fish-Man not played.
    expect(after.activeDon).toBe(1);
    expect(after.restedDon).toBe(0);
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.map((card) => card.instanceId)).toContain(southDiscardId);
    expect(after.hand.map((card) => card.instanceId)).toContain(shirahoshiId);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(after.characters.every((card) => card?.instanceId !== shirahoshiId)).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
