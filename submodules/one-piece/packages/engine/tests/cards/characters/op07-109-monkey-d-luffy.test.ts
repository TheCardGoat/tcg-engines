import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07MonkeyDLuffy109,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-109 Monkey.D.Luffy", () => {
  test("trashes itself at two Life, K.O.s within cost 4, then draws", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op07MonkeyDLuffy109],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy109);
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawnId = engine.getState().players.south.deck[0]!;

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Luffy's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("above two Life still trashes itself and draws but does not K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op07MonkeyDLuffy109],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      { character: [eb01Fourtricks025] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy109);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const drawnId = engine.getState().players.south.deck[0]!;

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself, K.O.'ing, or drawing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op07MonkeyDLuffy109],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018],
      },
      { character: [eb01Fourtricks025] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy109);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(luffyId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(luffyId);
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger K.O.s only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
      { life: [op07MonkeyDLuffy109] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const expensiveIds = engine
      .getView("south")
      .players.south.characters.filter(
        (card) => card?.cardId === eb01MountainGod018.id && card.instanceId !== attackerId,
      )
      .map((card) => card!.instanceId);
    const luffyId = engine.findCardInZone("north", "life", op07MonkeyDLuffy109);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Luffy's Trigger target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining(expensiveIds),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.prompts).toHaveLength(0);
  });
});
