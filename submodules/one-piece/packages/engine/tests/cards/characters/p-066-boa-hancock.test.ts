import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-066 Boa Hancock", () => {
  test.each([5, 6])("own-turn aura checks hand size %s and exact Kuja trait", (n) => {
    const e = OnePieceTestEngine.create({
      character: ["P-066", "OP01-078", "ST02-012"],
      hand: Array(n).fill("ST01-009"),
    });
    const cs = e.getView("south").players.south.characters;
    expect(cs[0]?.power).toBe(n === 5 ? 6000 : 5000);
    expect(cs[1]?.power).toBe(n === 5 ? 6000 : 5000);
    expect(cs[2]?.power).toBe(3000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.characters[1]?.power).toBe(5000);
  });
  test("playing a hand card crosses six to five and enables the aura", () => {
    const e = OnePieceTestEngine.create({
      character: ["P-066"],
      hand: Array(6).fill("ST01-009"),
      activeDon: 2,
    });
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asSouth().play("ST01-009");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
  });
});
