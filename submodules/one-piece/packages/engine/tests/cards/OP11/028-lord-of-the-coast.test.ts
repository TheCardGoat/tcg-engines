import { describe, expect, test } from "vite-plus/test";
import { op11LordOfTheCoast028 } from "../../../../cards/src/cards/OP11/characters/028-lord-of-the-coast.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP11-028 Lord of the Coast", () => {
  test("K.O.s a rested cost-3-or-less Character with its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Killer005, rested: true }],
      },
      {
        life: [op11LordOfTheCoast028],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("south", "character", op14eb04Killer005);

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
      selectedIds: [targetId],
    });

    expect(engine.findCardInZone("south", "trash", op14eb04Killer005)).toBe(targetId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
