import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Concasser059, op12Sanji041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-041 Sanji", () => {
  test("returns DON to activate a qualifying Event for free, then replenishes rested DON when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Sanji041,
        hand: [op12Concasser059],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eventId = engine.findCardInZone("south", "hand", op12Concasser059);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0, donDeckCount: 11 });

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 10 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
