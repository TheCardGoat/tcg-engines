import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12PortgasDAceSp011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST13-011 Portgas.D.Ace", () => {
  test("with two Life gains Rush and attacks on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12PortgasDAceSp011],
        life: [eb01Doma005, eb01Doma005],
        activeDon: op12PortgasDAceSp011.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op12PortgasDAceSp011, "south");
    const aceId = engine.findCardInZone("south", "character", op12PortgasDAceSp011);
    engine.declareAttack(aceId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === aceId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
