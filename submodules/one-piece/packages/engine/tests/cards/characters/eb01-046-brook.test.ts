import { describe, expect, test } from "vite-plus/test";
import { eb01Brook046, eb01Doma005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-046 Brook", () => {
  test("chains cost reduction into K.O. on play and again when attacking", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01Brook046], activeDon: 3 },
      { character: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(eb01Brook046);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId] }, "south");

    const brookId = engine.findCardInZone("south", "character", eb01Brook046);
    const secondId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(brookId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [secondId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [secondId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual([
      firstId,
      secondId,
    ]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
