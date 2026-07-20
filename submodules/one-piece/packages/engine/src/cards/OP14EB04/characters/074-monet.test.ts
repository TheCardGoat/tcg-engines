import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op01Shanks120,
  op04DonquixoteDoflamingo019,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Monet074 } from "../../../../../cards/src/cards/OP14EB04/characters/074-monet.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-074 Monet", () => {
  test("on play with an included Donquixote Pirates Leader may add one active DON", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04DonquixoteDoflamingo019,
      hand: [op14eb04Monet074],
      activeDon: op14eb04Monet074.cost,
      donDeckCount: 1,
    });

    engine.playCard(op14eb04Monet074, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("on play with a nonmatching Leader does not add DON", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op14eb04Monet074],
      activeDon: op14eb04Monet074.cost,
      donDeckCount: 1,
    });

    engine.playCard(op14eb04Monet074, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. draws two, trashes one selected hand card, then may add two rested DON", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Monet074, rested: true }],
        hand: [eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        donDeckCount: 2,
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const monetId = engine.findCardInZone("south", "character", op14eb04Monet074);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const discardId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.declareAttack(attackerId, monetId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Monet's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId, discardId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Monet's rested DON choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectAddDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([monetId, discardId]),
    );
    expect(view.players.south).toMatchObject({ restedDon: 2, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
