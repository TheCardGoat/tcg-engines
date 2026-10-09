import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("OP16 qualified card clauses", () => {
  test("OP16-022 cannot activate with no Characters (Q1299)", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP16-022", restedDon: 2, character: [] },
      {},
    );
    expect(() => e.asSouth().activateMain(e.leader("south"))).toThrow();
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test.each([true, false])(
    "OP16-081 uses opponent's cost-eight Character: %s (Q1326)",
    (hasLargeCharacter) => {
      const e = OnePieceTestEngine.create(
        { character: ["OP16-081"] },
        { character: hasLargeCharacter ? ["OP16-003", "EB01-005"] : ["EB01-005"] },
      );
      e.asSouth().activateMain("OP16-081");
      e.asSouth().acceptOptional();
      if (hasLargeCharacter) e.asSouth().chooseTargets("EB01-005");
      const view = e.getView("south");
      expect(view.players.south.characters[0]?.rested).toBe(true);
      expect(view.players.north.characters.find((c) => c?.cardId === "EB01-005")?.power).toBe(
        hasLargeCharacter ? 1000 : 3000,
      );
      expect(view.prompts).toHaveLength(0);
    },
  );
  test("OP16-087 can pay its trash cost without a Wano Leader, but draws nothing", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP16-087"], activeDon: 5 }, {});
    const deckBefore = e.getView("south").players.south.deckCount;
    e.asSouth().play("OP16-087");
    e.asSouth().acceptOptional();
    const view = e.getView("south");
    expect(view.players.south.trash.some((c) => c.cardId === "OP16-087")).toBe(true);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
  test("OP16-079 grants Rush only to the Wano Character played from trash", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP16-079", hand: ["OP16-085"], trash: ["OP01-040"], activeDon: 9 },
      {},
    );
    e.asSouth().play("OP16-085");
    const revived = e.findCardInZone("south", "trash", "OP01-040");
    e.resolveDecision("effectPlaySelection", { selectedIds: [revived] }, "south");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(() => e.asSouth().attack("OP16-085", e.leader("north"))).toThrow();
    e.asSouth().attack(revived, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
});
