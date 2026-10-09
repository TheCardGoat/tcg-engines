import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-005 Shanks", () => {
  test("paid On Play KOs all cost-one Characters on both fields without a selection", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-005", "ST08-003"], character: ["ST08-008", "ST08-003"], activeDon: 9 },
      { character: ["ST08-008", "ST08-003"] },
    );
    e.playCard("ST08-005");
    e.asSouth().acceptOptional();
    expect(
      e
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c?.cardId),
    ).toEqual(expect.arrayContaining(["ST08-003", "ST08-005"]));
    expect(
      e
        .getView("north")
        .players.north.characters.filter(Boolean)
        .map((c) => c?.cardId),
    ).toEqual(["ST08-003"]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST08-008");
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST08-008");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines the discard and leaves both low-cost Characters", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-005", "ST08-003"], character: ["ST08-008"], activeDon: 9 },
      { character: ["ST08-008"] },
    );
    e.playCard("ST08-005");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST08-003"]);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
});
