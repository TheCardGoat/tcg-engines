import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01DonquixoteDoflamingo073,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-073 Donquixote Doflamingo", () => {
  test("on play reorders the top five cards to the chosen deck end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01DonquixoteDoflamingo073],
      activeDon: op01DonquixoteDoflamingo073.cost,
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
    });
    const lookedIds = engine.getState().players.south.deck.slice(0, 5);

    engine.playCard(op01DonquixoteDoflamingo073, "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Doflamingo's deck order.");
    const chosenOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-5)).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("can become the new attack target as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01DonquixoteDoflamingo073, playedOnTurn: 0 }],
      },
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op01DonquixoteDoflamingo073);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(true);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
