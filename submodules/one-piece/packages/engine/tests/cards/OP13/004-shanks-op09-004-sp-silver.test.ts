import { describe, expect, test } from "vite-plus/test";
import { op01XDrake054 } from "../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { op13ShanksOp09004SpSilver004 } from "../../../../cards/src/cards/OP13/characters/004-shanks-op09-004-sp-silver.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-004 Shanks (OP13 SP)", () => {
  test("reduces every opposing Character by 1000 power and can attack on the turn played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13ShanksOp09004SpSilver004],
        activeDon: 10,
      },
      {
        character: [op01XDrake054],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op13ShanksOp09004SpSilver004);
    const shanksId = engine.findCardInZone("south", "character", op13ShanksOp09004SpSilver004);

    expect(engine.getView("south").players.north.characters[0]?.power).toBe(5000);

    engine.declareAttack(shanksId, engine.leader("north"));

    expect(engine.getState().cards[shanksId]?.rested).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
