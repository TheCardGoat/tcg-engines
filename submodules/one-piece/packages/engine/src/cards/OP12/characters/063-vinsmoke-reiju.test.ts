import { describe, expect, test } from "vite-plus/test";
import { eb01OffWhite019 } from "@tcg/op-cards";
import { op12VinsmokeReiju063 } from "../../../../../cards/src/cards/OP12/characters/063-vinsmoke-reiju.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-063 Vinsmoke Reiju", () => {
  test("gains +2000 power and +5 cost with four Events in trash", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12VinsmokeReiju063],
      trash: [eb01OffWhite019, eb01OffWhite019, eb01OffWhite019, eb01OffWhite019],
    });
    const reijuId = engine.findCardInZone("south", "character", op12VinsmokeReiju063);

    const reiju = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === reijuId);
    expect(reiju).toMatchObject({ power: 7000, cost: 9 });
  });
});
