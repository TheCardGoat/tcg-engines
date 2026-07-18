import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Edison100,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-100 Edison", () => {
  test("at two Life draws two, then trashes two chosen hand cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Edison100, eb01Doma005],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Fourtricks025, eb01Doma005],
      activeDon: op07Edison100.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);

    engine.playCard(op07Edison100, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Edison's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([retainedId, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: drawnIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([retainedId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw or trash above the two-Life boundary", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Edison100, eb01Doma005],
      life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      deck: [eb01MountainGod018, eb01Fourtricks025],
      activeDon: op07Edison100.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op07Edison100, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([retainedId]);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays the physical card and resolves its On Play effect with Vegapunk", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07Vegapunk097,
        hand: [eb01Doma005],
        life: [op07Edison100, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Fourtricks025, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const edisonId = engine.findCardInZone("north", "life", op07Edison100);
    const retainedId = engine.findCardInZone("north", "hand", eb01Doma005);
    const drawnIds = engine.getState().players.north.deck.slice(0, 2);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: drawnIds }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(edisonId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(edisonId);
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([retainedId]);
    expect(view.players.north.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
