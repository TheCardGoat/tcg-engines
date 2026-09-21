import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-026 Fugar", () => {
  test("[When Attacking] resolves against a rested opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-026", attachedDon: 1 }], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }], activeDon: 5 },
    );

    engine.asSouth().attack("OP17-026", "OP13-013");
    // After attacking, Fugar rests.
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.cardId === "OP17-026")
        ?.rested,
    ).toBe(true);
  });

  test("[On K.O.] resolves when K.O.'d by an attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-026", rested: true }] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-026");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP17-026");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(cardId);
  });
});
