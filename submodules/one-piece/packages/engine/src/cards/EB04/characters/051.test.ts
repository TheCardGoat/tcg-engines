import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-051", () => {
  test("cannot attack without a 12000-power Character on the field", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-051", attachedDon: 2 }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    expect(() => engine.asSouth().attack("EB04-051", newgateId)).toThrow();
    expect(engine.getView("south").players.north.trash).toHaveLength(0);
  });

  test("attacks once any Character reaches 12000 base power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-051", attachedDon: 2 }], activeDon: 5 },
      { character: [{ cardId: "OP13-082", rested: true }], activeDon: 5 },
    );
    const elderId = engine.findCardInZone("north", "character", "OP13-082");

    engine.asSouth().attack("EB04-051", elderId);

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.north.trash).toHaveLength(0);
  });
});
