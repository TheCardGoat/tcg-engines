import { describe, expect, test } from "vite-plus/test";
import { op01RoronoaZoro001 } from "../../../../cards/src/cards/OP01/leaders/001-roronoa-zoro.ts";
import { op02Sakazuki099 } from "../../../../cards/src/cards/OP02/characters/099-sakazuki.ts";
import { op12RoronoaZoro036 } from "../../../../cards/src/cards/OP12/characters/036-roronoa-zoro.ts";
import { op12RoronoaZoro113 } from "../../../../cards/src/cards/OP12/characters/113-roronoa-zoro.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP12-036 Roronoa Zoro", () => {
  test("gains +1000 power while its Leader has the Slash attribute", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      character: [op12RoronoaZoro036],
    });
    const zoroId = engine.findCardInZone("south", "character", op12RoronoaZoro036);

    const projectedZoro = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === zoroId);

    expect(projectedZoro?.power).toBe((op12RoronoaZoro036.power ?? 0) + 1000);
  });

  test("cannot be selected when another card effect plays a Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [op12RoronoaZoro113],
        hand: [op12RoronoaZoro036, op14eb04Killer005],
      },
      {
        hand: [op02Sakazuki099, op14eb04Killer005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koTargetId = engine.findCardInZone("south", "character", op12RoronoaZoro113);
    const protectedZoroId = engine.findCardInZone("south", "hand", op12RoronoaZoro036);
    const killerId = engine.findCardInZone("south", "hand", op14eb04Killer005);

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
    const koPrompt = pendingPrompt(engine, "effectTargetSelection");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: koPrompt!.id,
      selectedIds: [koTargetId],
    });

    const playPrompt = pendingPrompt(engine, "effectPlaySelection");
    expect(playPrompt).toBeDefined();
    expect(playPrompt!.options.map((option) => option.targetId)).toEqual([killerId]);
    expect(playPrompt!.options.some((option) => option.targetId === protectedZoroId)).toBe(false);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: playPrompt!.id,
      selectedIds: [killerId],
    });

    expect(engine.findCardInZone("south", "hand", op12RoronoaZoro036)).toBe(protectedZoroId);
    expect(engine.findCardInZone("south", "character", op14eb04Killer005)).toBe(killerId);
    expect(engine.getState().cards[killerId]?.rested).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
