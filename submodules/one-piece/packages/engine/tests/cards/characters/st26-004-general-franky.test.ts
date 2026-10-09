import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST26-004 Franky", () => {
  test.each([0, 1, 2])("returns two DON then reduces %s opponents this turn", (count) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST26-004"], activeDon: 8, donDeckCount: 2 },
      { character: ["ST02-006", "ST02-012"] },
    );
    const ids = e
      .getView("south")
      .players.north.characters.filter(Boolean)
      .map((c) => c!.instanceId)
      .filter((id): id is string => id !== null);
    e.asSouth().play("ST26-004");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(...ids.slice(0, count));
    expect(e.getView("south").players.south.restedDon).toBe(6);
    expect(e.getView("south").players.south.donDeckCount).toBe(4);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(count ? 4000 : 6000);
    expect(e.getView("north").players.north.characters[1]?.power).toBe(count === 2 ? 1000 : 3000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
    expect(e.getView("north").players.north.characters[1]?.power).toBe(3000);
  });
  test("declines optional DON return and does not reduce power", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST26-004"], activeDon: 8, donDeckCount: 2 },
      { character: ["ST02-006"] },
    );
    e.asSouth().play("ST26-004");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(8);
    expect(e.getView("south").players.south.donDeckCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
  });
});
