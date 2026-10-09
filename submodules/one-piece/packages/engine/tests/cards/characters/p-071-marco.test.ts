import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-071-marco", () => {
  test.each([true, false])("On battle KO optional physical return=%s", (accept) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: [{ cardId: "P-071", rested: true }], activeDon: 1 },
      { leaderCardId: "ST01-001", character: [{ cardId: "OP01-120", playedOnTurn: 0 }] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const id = e.findCardInZone("south", "character", "P-071");
    e.asSouth().attachDon(id, 1);
    e.asSouth().endTurn();
    e.asNorth().attack(e.findCardInZone("north", "character", "OP01-120"), id);
    if (accept) e.asSouth().acceptOptional();
    else e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.some((c) => c.instanceId === id)).toBe(accept);
    expect(e.getView("south").players.south.trash.some((c) => c.instanceId === id)).toBe(!accept);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("effect KO returns only the physical source", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: ["OP04-038"], activeDon: 5 },
      { leaderCardId: "ST01-001", character: ["P-071"], trash: ["P-071"] },
    );
    const id = e.findCardInZone("north", "character", "P-071"),
      other = e.findCardInZone("north", "trash", "P-071");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets(id);
    e.asSouth().chooseTargets(id);
    e.asNorth().acceptOptional();
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(other);
  });
});
