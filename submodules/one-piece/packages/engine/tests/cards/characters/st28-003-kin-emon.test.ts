import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st28-003-kin-emon", () => {
  test("Life Trigger plays the actual card with Wano Leader and opponent Life3", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST09-001", life: ["ST28-003"] },
      { life: 3 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "life", "ST28-003");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(id);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test.each([
    ["ST09-001", 4],
    ["ST05-001", 3],
  ])("Trigger fails independent condition %s/%s", (leader, life) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: leader, life: ["ST28-003"] },
      { life },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST28-003");
  });
});
