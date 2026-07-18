import { describe, expect, test } from "vite-plus/test";
import { op11Ishilly025 } from "../../../../cards/src/cards/OP11/characters/025-ishilly.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP11-025 Ishilly", () => {
  test("rests a DON and herself to give +1000 power during an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Ishilly025],
        activeDon: 1,
      },
      {
        character: [op14eb04Killer005],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ishillyId = engine.findCardInZone("south", "character", op11Ishilly025);
    const attackerId = engine.findCardInZone("north", "character", op14eb04Killer005);
    const leaderId = engine.leader("south");

    engine.declareAttack(attackerId, leaderId, "north");
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectOptional")!.id,
      optionId: "yes",
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [leaderId],
    });

    expect(engine.getState().cards[ishillyId]?.rested).toBe(true);
    expect(engine.getState().players.south.activeDon).toBe(0);
    expect(engine.getState().players.south.restedDon).toBe(1);
    expect(
      engine
        .getView("south")
        .logs.some(
          (entry) => entry.message.includes("gives") && entry.message.includes("+1000 power"),
        ),
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
