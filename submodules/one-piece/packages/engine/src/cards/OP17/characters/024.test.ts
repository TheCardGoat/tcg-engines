import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-024 Howling Gab", () => {
  test("On Play rests an opposing Character; later Banish trashes Life without its Trigger", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-024"], activeDon: 8 },
      {
        character: ["EB01-018"],
        life: ["OP17-076", "ST02-002"],
        deck: ["ST02-002", "ST02-003"],
        activeDon: 2,
      },
    );
    const target = e.findCardInZone("north", "character", "EB01-018");
    e.playCard("OP17-024");
    e.asSouth().chooseTargets(target);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
    e.endTurn("south");
    e.endTurn("north");
    const before = e.getView("north").players.north;
    e.asSouth().attack("OP17-024", e.leader("north"));
    e.asNorth().chooseCounter();
    const after = e.getView("north").players.north;
    expect(after.lifeCount).toBe(before.lifeCount - 1);
    expect(after.handCount).toBe(before.handCount);
    expect(after.trash.map((c) => c.cardId)).toContain("OP17-076");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("On Play may choose no opposing Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-024"], activeDon: 8 },
      { character: ["EB01-018"] },
    );
    e.playCard("OP17-024");
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
