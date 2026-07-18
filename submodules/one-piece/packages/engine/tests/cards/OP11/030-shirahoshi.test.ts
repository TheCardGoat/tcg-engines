import { describe, expect, test } from "vite-plus/test";
import { op11Ishilly025 } from "../../../../cards/src/cards/OP11/characters/025-ishilly.ts";
import { op11BulgeEyedNeptunian027 } from "../../../../cards/src/cards/OP11/characters/027-bulge-eyed-neptunian.ts";
import { op11Shirahoshi030 } from "../../../../cards/src/cards/OP11/characters/030-shirahoshi.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP11-030 Shirahoshi", () => {
  test("rests 1 DON!! and itself to find a Neptunian or Fish-Man Island card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Shirahoshi030],
        deck: [op11BulgeEyedNeptunian027, op11Ishilly025, op14eb04Killer005],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shirahoshiId = engine.findCardInZone("south", "character", op11Shirahoshi030);
    const neptunianId = engine.findCardInZone("south", "deck", op11BulgeEyedNeptunian027);
    const fishManIslandId = engine.findCardInZone("south", "deck", op11Ishilly025);
    const killerId = engine.findCardInZone("south", "deck", op14eb04Killer005);

    engine.activateEffect(shirahoshiId, "activateMain", "south");
    const optionalPrompt = pendingPrompt(engine, "effectOptional");
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });

    expect(engine.getState().cards[shirahoshiId]?.rested).toBe(true);
    expect(engine.getState().players.south.activeDon).toBe(0);
    expect(engine.getState().players.south.restedDon).toBe(1);
    const selectionPrompt = pendingPrompt(engine, "effectSearchSelection");
    expect(selectionPrompt).toBeDefined();
    expect(
      selectionPrompt!.options
        .filter((option) => option.enabled !== false)
        .map((option) => option.targetId),
    ).toEqual([neptunianId, fishManIslandId]);
    expect(selectionPrompt!.options.find((option) => option.targetId === killerId)?.enabled).toBe(
      false,
    );

    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: selectionPrompt!.id,
      selectedIds: [fishManIslandId],
    });

    const orderPrompt = pendingPrompt(engine, "effectSearchRemainderOrder");
    expect(orderPrompt).toBeDefined();
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: orderPrompt!.id,
      selectedIds: [killerId, neptunianId],
    });

    expect(engine.findCardInZone("south", "hand", op11Ishilly025)).toBe(fishManIslandId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
