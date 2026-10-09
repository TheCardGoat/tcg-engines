import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST05-001 Shanks", () => {
  test("returns three DON to boost only own FILM Characters this turn, never the Leader", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST05-001",
        character: ["ST05-002", "ST05-006", "ST04-012"],
        activeDon: 3,
        restedDon: 3,
      },
      { character: ["ST05-002"] },
    );
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1", "active-don:2"] },
      "south",
    );
    expect(
      e
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c?.power),
    ).toEqual([7000, 8000, 6000]);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.restedDon).toBe(3);
    const repeat = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(repeat.reason).toBe("This effect has already been used this turn.");
    e.asSouth().endTurn();
    expect(
      e
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c?.power),
    ).toEqual([5000, 6000, 6000]);
  });
  test("decline preserves DON, power and once-per-turn opportunity", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST05-001",
      activeDon: 3,
      character: ["ST05-002"],
    });
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
  });
});
