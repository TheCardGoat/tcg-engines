import { describe, expect, test } from "vite-plus/test";
import { eb01Hannyabal021 } from "../../../../cards/src/cards/EB01/leaders/021-hannyabal.ts";
import { op11Ishilly025 } from "../../../../cards/src/cards/OP11/characters/025-ishilly.ts";
import { op11FisherTiger035 } from "../../../../cards/src/cards/OP11/characters/035-fisher-tiger.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { op14eb04SilversRayleigh108 } from "../../../../cards/src/cards/OP14EB04/characters/108-silvers-rayleigh.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP11-035 Fisher Tiger", () => {
  test("rests 1 DON!! to play a Fish-Man or Merfolk after an opponent effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11FisherTiger035],
        hand: [op11Ishilly025],
        life: 3,
        activeDon: 1,
      },
      {
        leaderCardId: eb01Hannyabal021,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fisherTigerId = engine.findCardInZone("south", "character", op11FisherTiger035);
    const ishillyId = engine.findCardInZone("south", "hand", op11Ishilly025);

    engine.playCard(op14eb04SilversRayleigh108, "north");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [fisherTigerId],
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
      promptId: pendingPrompt(engine, "effectPlaySelection")!.id,
      selectedIds: [ishillyId],
    });

    expect(engine.findCardInZone("south", "trash", op11FisherTiger035)).toBe(fisherTigerId);
    expect(engine.findCardInZone("south", "character", op11Ishilly025)).toBe(ishillyId);
    expect(engine.getState().players.south.activeDon).toBe(0);
    expect(engine.getState().players.south.restedDon).toBe(1);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });

  test("rests an opponent's Character on play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11FisherTiger035],
        activeDon: op11FisherTiger035.cost,
      },
      {
        character: [op14eb04Killer005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const killerId = engine.findCardInZone("north", "character", op14eb04Killer005);

    engine.playCard(op11FisherTiger035);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [killerId],
    });

    expect(engine.getState().cards[killerId]?.rested).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
