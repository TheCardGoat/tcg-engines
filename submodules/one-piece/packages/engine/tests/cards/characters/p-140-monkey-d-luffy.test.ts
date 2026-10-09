import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-140 Monkey.D.Luffy", () => {
  test("gives two rested DON to one recipient then blocks next turn", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: ["P-140"], activeDon: 7 },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
    );
    e.asSouth().play("P-140");
    const luffy = e.findCardInZone("south", "character", "P-140");
    e.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(2);
    expect(e.getView("south").players.south.restedDon).toBe(5);
    e.asSouth().endTurn();
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    e.resolveDecision("battleBlocker", { selectedIds: [luffy] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(luffy);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
