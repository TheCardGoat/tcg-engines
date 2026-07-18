import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, prb02SanGorouPirateFoil003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST18-003 San-Gorou", () => {
  test("draws when attacking with eight DON!! on its field", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02SanGorouPirateFoil003, playedOnTurn: 0 }],
        deck: [eb01Doma005],
        activeDon: 8,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sanGorouId = engine.findCardInZone("south", "character", prb02SanGorouPirateFoil003);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(sanGorouId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(0);
  });
});
