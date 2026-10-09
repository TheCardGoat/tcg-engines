import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-052 dracule-mihawk", () => {
  test.each([
    ["OP01-120", 1, true],
    ["OP01-120", 0, false],
    ["ST14-012", 1, false],
  ] as const)("battle against %s with %i DON", (attacker, don, survives) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: [{ cardId: "P-052", rested: true }], activeDon: 1 },
      { leaderCardId: "ST01-001", character: [{ cardId: attacker, playedOnTurn: 0 }] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const c = e.findCardInZone("south", "character", "P-052");
    if (don) e.asSouth().attachDon(c, 1);
    e.asSouth().endTurn();
    e.asNorth().attack(e.findCardInZone("north", "character", attacker), c);
    expect(e.getView("south").players.south.characters.some((x) => x?.instanceId === c)).toBe(
      survives,
    );
  });
  test("effect KO is not prevented", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-052"], activeDon: 1 },
      { leaderCardId: "ST04-001", hand: ["OP01-094"], activeDon: 10 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const c = e.findCardInZone("south", "character", "P-052");
    e.asSouth().attachDon(c, 1);
    e.asSouth().endTurn();
    e.asNorth().play("OP01-094");
    e.asNorth().acceptOptional();
    e.resolveDecision(
      "effectCostReturnDon",
      {
        selectedIds: [
          "rested-don:0",
          "rested-don:1",
          "rested-don:2",
          "rested-don:3",
          "rested-don:4",
          "rested-don:5",
        ],
      },
      "north",
    );
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(c);
  });
  test("matching Leader battle also cannot KO this Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-002", activeDon: 3 },
      { character: [{ cardId: "P-052", attachedDon: 1, rested: true }] },
    );
    const c = e.findCardInZone("north", "character", "P-052");
    e.asSouth().attachDon(e.leader("south"), 3);
    expect(e.getView("south").players.south.leader.power).toBe(8000);
    e.asSouth().attack(e.leader("south"), c);
    expect(e.getView("north").players.north.characters.some((x) => x?.instanceId === c)).toBe(true);
    expect(e.getView("north").players.north.restedDon).toBe(0);
  });
});
