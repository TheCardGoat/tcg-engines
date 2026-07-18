import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10JesusBurgess085 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-085 Jesus Burgess", () => {
  test("with one attached DON!! and eight trash cards, gains Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10JesusBurgess085],
        trash: Array.from({ length: 8 }, () => eb01Doma005),
        activeDon: op10JesusBurgess085.cost + 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op10JesusBurgess085, "south");
    const burgessId = engine.findCardInZone("south", "character", op10JesusBurgess085);
    engine.attachDon(burgessId, 1, "south");
    engine.declareAttack(burgessId, engine.leader("north"), "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === burgessId)?.rested,
    ).toBe(true);
  });

  test("cannot attack on its play turn with only seven trash cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10JesusBurgess085],
        trash: Array.from({ length: 7 }, () => eb01Doma005),
        activeDon: op10JesusBurgess085.cost + 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op10JesusBurgess085, "south");
    const burgessId = engine.findCardInZone("south", "character", op10JesusBurgess085);
    engine.attachDon(burgessId, 1, "south");
    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: burgessId,
      targetId: engine.leader("north"),
    });

    expect(failure.reason).toContain("cannot attack");
  });
});
