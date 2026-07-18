import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06VinsmokeReiju042,
} from "@tcg/op-cards";
import { op11Nami054 } from "../../../../../cards/src/cards/OP11/characters/054-nami.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-054 Nami", () => {
  test("with a multicolored Leader, draws three and orders two hand cards at a chosen deck end", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      hand: [op11Nami054, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op11Nami054.cost,
    });
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op11Nami054, "south");

    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (selection?.kind !== "selectEntity") throw new Error("Expected Nami's hand selection.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstDrawnId, secondDrawnId] },
      "south",
    );
    const order = engine.pendingDecision("effectReturnToDeckOrder", "south").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 2, max: 2 });
    engine.resolveDecision(
      "effectReturnToDeckOrder",
      { selectedIds: [secondDrawnId, firstDrawnId] },
      "south",
    );
    const position = engine.pendingDecision("effectDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    engine.resolveDecision("effectDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([secondDrawnId, firstDrawnId]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("can become the new target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Nami054] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const namiId = engine.findCardInZone("south", "character", op11Nami054);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [namiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === namiId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
