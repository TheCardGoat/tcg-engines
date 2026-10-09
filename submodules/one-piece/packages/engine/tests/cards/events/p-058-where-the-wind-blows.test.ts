import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-058 Where the Wind Blows", () => {
  test.each(["ST11-001", "ST01-001"])("Main readies FILM only at end with Leader %s", (leader) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: leader,
      hand: ["P-058"],
      activeDon: 2,
      character: [
        { cardId: "ST05-007", rested: true },
        { cardId: "ST02-002", rested: true },
      ],
    });
    e.asSouth().play("P-058");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(leader !== "ST11-001");
    expect(e.getView("south").players.south.characters[1]?.rested).toBe(true);
  });
  test("end effect includes FILM played and rested after Event resolution", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", hand: ["P-058", "ST05-004", "P-060"], activeDon: 8 },
      { activeDon: 2 },
    );
    e.asSouth().play("P-058");
    e.asSouth().play("ST05-004");
    const uta = e.findCardInZone("south", "character", "ST05-004");
    e.asSouth().play("P-060");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostRestCards", { selectedIds: [uta] }, "south");
    e.resolveDecision("effectMixedRestSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
  test("Trigger readies FILM immediately without an Uta Leader", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001" },
      {
        leaderCardId: "ST01-001",
        life: ["P-058", "ST02-002"],
        character: [
          { cardId: "ST05-007", rested: true },
          { cardId: "ST02-002", rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(true);
  });
});
