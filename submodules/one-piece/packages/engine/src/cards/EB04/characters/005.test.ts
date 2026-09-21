import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-005", () => {
  test("cannot attack while the opponent has fewer than two 5000-power Characters", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB04-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    expect(() => engine.asSouth().attack("EB04-005", newgateId)).toThrow();
    expect(engine.getView("south").players.north.trash).toHaveLength(0);
  });

  test("attacks once the opponent has two Characters of 5000 power or more", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-005", attachedDon: 2 }], activeDon: 5 },
      { character: ["OP16-003", { cardId: "EB04-048", rested: true }], activeDon: 5 },
    );
    const lucciId = engine.findCardInZone("north", "character", "EB04-048");

    engine.asSouth().attack("EB04-005", lucciId);

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(lucciId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
