import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-013 Kid", () => {
  test.each([0, 1])("end of turn readies with DON %i and can then Block", (attachedDon) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-013", rested: true, attachedDon }] },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST02-013");
    e.endTurn("south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(!attachedDon);
    if (attachedDon) {
      const before = e.getView("south").players.south.lifeCount;
      e.declareAttack(
        e.findCardInZone("north", "character", "EB01-018"),
        e.leader("south"),
        "north",
      );
      e.resolveDecision("battleBlocker", { selectedIds: [id] }, "south");
      expect(e.getView("south").players.south.lifeCount).toBe(before);
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    }
  });
});
