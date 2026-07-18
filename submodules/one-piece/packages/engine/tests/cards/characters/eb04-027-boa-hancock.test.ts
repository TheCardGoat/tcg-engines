import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Braham111,
  op14eb04BoaHancockEb04027027,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-027 Boa Hancock", () => {
  test("draws two cards and trashes one card from hand on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04BoaHancockEb04027027, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op14eb04BoaHancockEb04027027.cost,
    });
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = [...engine.getState().players.south.deck].slice(0, 2);

    engine.playCard(op14eb04BoaHancockEb04027027, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity")
      throw new Error("Expected Boa Hancock's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardId, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays only a Trigger Character with 5000 power or less from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04BoaHancockEb04027027],
        hand: [op06Braham111, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "hand", op06Braham111);
    const ineligibleId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity")
      throw new Error("Expected Boa Hancock's Trigger play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId),
    ).toBeDefined();
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
