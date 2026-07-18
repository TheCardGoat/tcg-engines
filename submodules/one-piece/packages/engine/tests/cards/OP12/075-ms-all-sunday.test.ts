import { describe, expect, test } from "vite-plus/test";
import { op12MsAllSunday075 } from "../../../../cards/src/cards/OP12/characters/075-ms-all-sunday.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP12-075 Ms. All Sunday", () => {
  test("lets the opponent add an active DON!! after its On Play K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12MsAllSunday075],
        activeDon: op12MsAllSunday075.cost,
      },
      {
        character: [op14eb04Killer005],
        donDeckCount: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const killerId = engine.findCardInZone("north", "character", op14eb04Killer005);

    engine.playCard(op12MsAllSunday075);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [killerId],
    });

    const addDonPrompt = pendingPrompt(engine, "effectAddDon");
    expect(addDonPrompt?.seat).toBe("north");
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: addDonPrompt!.id,
      optionId: "1",
    });

    expect(engine.findCardInZone("north", "trash", op14eb04Killer005)).toBe(killerId);
    expect(engine.getState().players.north.activeDon).toBe(1);
    expect(engine.getState().players.north.donDeckCount).toBe(0);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
