import { describe, expect, test } from "vite-plus/test";
import {
  op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
  op06Inazuma002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-002 Inazuma", () => {
  test("gains Banish at 7000 power and trashes damaged Life without its Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Inazuma002, attachedDon: 2, playedOnTurn: 0 }] },
      { life: [op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inazumaId = engine.findCardInZone("south", "character", op06Inazuma002);
    const lifeId = engine.findCardInZone(
      "north",
      "life",
      op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
    );

    engine.declareAttack(inazumaId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.decisions).toHaveLength(0);
  });
});
