import { describe, expect, test } from "vite-plus/test";
import { op12Pacifista109 } from "../../../../cards/src/cards/OP12/characters/109-pacifista.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP12-109 Pacifista", () => {
  test("K.O.s a cost-1 Character and remains in hand after its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Killer005],
      },
      {
        life: [op12Pacifista109],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const killerId = engine.findCardInZone("south", "character", op14eb04Killer005);
    const pacifistaId = engine.findCardInZone("north", "life", op12Pacifista109);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "lifeTrigger")!.id,
      optionId: "activate",
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [killerId],
    });

    expect(engine.findCardInZone("south", "trash", op14eb04Killer005)).toBe(killerId);
    expect(engine.findCardInZone("north", "hand", op12Pacifista109)).toBe(pacifistaId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
