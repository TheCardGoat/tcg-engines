import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06Daruma029, op06HodyJones020 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-029 Daruma", () => {
  test("with attached DON!! and an included Leader, reactivates once, gains power, and takes one Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [{ card: op06Daruma029, attachedDon: 1, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const darumaId = engine.findCardInZone("south", "character", op06Daruma029);

    engine.declareAttack(darumaId, engine.leader("north"), "south");
    let view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === darumaId),
    ).toMatchObject({ rested: false, power: 6000 });

    engine.declareAttack(darumaId, engine.leader("north"), "south");

    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === darumaId),
    ).toMatchObject({ rested: true, power: 6000 });
  });

  test("does not reactivate or take Life without attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [{ card: op06Daruma029, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const darumaId = engine.findCardInZone("south", "character", op06Daruma029);

    engine.declareAttack(darumaId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === darumaId),
    ).toMatchObject({ rested: true, power: 4000 });
  });
});
