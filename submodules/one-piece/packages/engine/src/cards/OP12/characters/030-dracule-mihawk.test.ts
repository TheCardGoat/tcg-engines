import { describe, expect, test } from "vite-plus/test";
import { eb01CharlotteCompote055, eb01Crocus041, op12DraculeMihawk030 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-030 Dracule Mihawk", () => {
  test("sets four DON!! active and blocks base-cost-7 Character plays for the turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12DraculeMihawk030, eb01CharlotteCompote055, eb01Crocus041],
      activeDon: 10,
    });
    const blockedId = engine.findCardInZone("south", "hand", eb01CharlotteCompote055);

    engine.playCard(op12DraculeMihawk030, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "4" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 6, restedDon: 4 });
    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: blockedId }).reason,
    ).toBe("A card effect prevents this card from being played.");
    engine.playCard(eb01Crocus041, "south");
    expect(engine.getView("south").players.south.activeDon).toBe(0);
  });

  test("can block an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12DraculeMihawk030] },
      { character: [{ card: eb01CharlotteCompote055, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mihawkId = engine.findCardInZone("south", "character", op12DraculeMihawk030);
    const attackerId = engine.findCardInZone("north", "character", eb01CharlotteCompote055);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [mihawkId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mihawkId);
  });
});
