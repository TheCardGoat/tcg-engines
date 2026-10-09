import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-060 Ulti & Page One", () => {
  test("adds active DON before selecting a power3000 Character to K.O.", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST04-001", hand: ["OP17-060"], activeDon: 6, donDeckCount: 4 },
      { character: ["EB01-005", "EB01-025"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.playCard("OP17-060");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    const choice = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected KO target");
    expect(choice.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.restedDon).toBe(6);
  });
  test("declining the optional DON addition still performs the following K.O.", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST04-001", hand: ["OP17-060"], activeDon: 6, donDeckCount: 4 },
      { character: ["EB01-005"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.playCard("OP17-060");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("wrong Leader receives neither DON nor K.O.", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP17-060"], activeDon: 6, donDeckCount: 4 },
      { character: ["EB01-005"] },
    );
    e.playCard("OP17-060");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
