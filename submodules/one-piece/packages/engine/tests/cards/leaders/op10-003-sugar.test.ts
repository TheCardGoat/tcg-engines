import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Buffalo073, op10DivineDeparture019, op10Sugar003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-003 Sugar", () => {
  test("readies one DON!! at end of turn with a 6000-power Donquixote Pirates Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Sugar003,
      character: [op10Buffalo073],
      restedDon: 1,
    });

    engine.endTurn("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("adds one active DON!! after the first Counter Event activated on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Sugar003,
        hand: [op10DivineDeparture019, op10DivineDeparture019],
        deck: [eb01Doma005],
        activeDon: 1,
        donDeckCount: 2,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const eventIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op10DivineDeparture019.id)
      .map((card) => card.instanceId);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[0]!] }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[1]!] }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
