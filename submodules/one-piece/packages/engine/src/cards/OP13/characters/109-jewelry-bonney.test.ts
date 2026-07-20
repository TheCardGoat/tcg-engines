import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kaido094,
  op14eb04Shiryu048,
} from "@tcg/op-cards";
import { op13JewelryBonney109 } from "../../../../../cards/src/cards/OP13/characters/109-jewelry-bonney.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function targetBonneyWithShiryu(engine: OnePieceTestEngine) {
  const bonneyId = engine.findCardInZone("south", "character", op13JewelryBonney109);
  engine.playCard(op14eb04Shiryu048, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [bonneyId] }, "north");
  return bonneyId;
}

describe("OP13-109 Jewelry Bonney", () => {
  test("may turn the top Life face-up instead of opponent-effect removal", () => {
    const engine = OnePieceTestEngine.create(
      { life: [eb01Doma005], character: [op13JewelryBonney109] },
      { hand: [op14eb04Shiryu048], activeDon: op14eb04Shiryu048.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const bonneyId = targetBonneyWithShiryu(engine);

    expect(engine.pendingDecision("effectRemovalReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(bonneyId);
    expect(view.players.south.life[0]).toMatchObject({
      instanceId: lifeId,
      cardId: eb01Doma005.id,
      hidden: false,
    });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the replacement and be removed", () => {
    const engine = OnePieceTestEngine.create(
      { life: [eb01Doma005], character: [op13JewelryBonney109] },
      { hand: [op14eb04Shiryu048], activeDon: op14eb04Shiryu048.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonneyId = targetBonneyWithShiryu(engine);

    engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(bonneyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bonneyId);
    expect(view.players.south.life[0]).toMatchObject({ hidden: true });
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot replace removal when the top Life is already face-up", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [{ card: eb01Doma005, faceUp: true }],
        character: [op13JewelryBonney109],
      },
      { hand: [op14eb04Shiryu048], activeDon: op14eb04Shiryu048.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonneyId = targetBonneyWithShiryu(engine);

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      bonneyId,
    );
  });

  test("does not replace battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { life: [eb01Doma005], character: [{ card: op13JewelryBonney109, rested: true }] },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonneyId = engine.findCardInZone("south", "character", op13JewelryBonney109);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.declareAttack(attackerId, bonneyId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(bonneyId);
    expect(view.players.south.life[0]).toMatchObject({ hidden: true });
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger draws two then trashes one controller-selected hand card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13JewelryBonney109, eb01Doma005],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005],
        hand: [eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op13JewelryBonney109);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const paymentId = engine.findCardInZone("north", "hand", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const cost = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    if (cost?.kind !== "selectEntity") throw new Error("Expected Bonney's hand-trash choice.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paymentId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([triggerId, paymentId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
