import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST05-002 Ain", () => {
  test.each([0, 1])("On Play chooses %s rested DON", (amount) => {
    const e = OnePieceTestEngine.create({ hand: ["ST05-002"], activeDon: 4, donDeckCount: 3 });
    e.asSouth().play("ST05-002");
    e.asSouth().chooseAddDon(amount);
    expect(e.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 4 + amount,
      donDeckCount: 3 - amount,
    });
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
});
