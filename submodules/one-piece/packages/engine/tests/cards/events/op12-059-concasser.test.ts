import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12Concasser059, op12Sanji041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-059 Concasser", () => {
  test("Main with Sanji draws one card", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [op12Concasser059],
      deck: [eb01Doma005],
      activeDon: 1,
    });
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op12Concasser059);

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter counts itself as the fourth trashed Event before granting Leader power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op12Concasser059],
        trash: [op12Concasser059, op12Concasser059, op12Concasser059],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op12Concasser059);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
