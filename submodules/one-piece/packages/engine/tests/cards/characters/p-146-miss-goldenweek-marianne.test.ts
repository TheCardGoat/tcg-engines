import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-146", () => {
  test("On K.O. draws even without a cost-zero rest target", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-146", rested: true }], deck: ["EB01-005", "EB01-025"] },
      { character: ["OP16-003"] },
      { activeSeat: "north" },
    );
    const drawn = e.findCardInZone("south", "deck", "EB01-005");
    e.asNorth().attack("OP16-003", "P-146");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([drawn]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("On K.O. draws and rests the reduced cost-zero opposing Character", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["P-146"],
        hand: ["OP02-106", "P-144"],
        activeDon: 6,
        deck: ["EB01-005", "EB01-025", "EB01-018"],
      },
      { character: ["EB01-005", "EB01-025"] },
    );
    const zero = e.findCardInZone("north", "character", "EB01-005"),
      source = e.findCardInZone("south", "character", "P-146");
    e.playCard("OP02-106");
    e.resolveDecision("effectTargetSelection", { selectedIds: [zero] }, "south");
    e.playCard("P-144");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostKoCharacter", { selectedIds: [source] }, "south");
    const s = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (s.kind !== "selectEntity") throw Error("rest");
    expect(s.candidates.map((c) => c.ref.id)).toEqual([zero]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [zero] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === zero)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.hand).toHaveLength(2);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
});
