import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07BoaHancock038,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Shakuyaku107 } from "../../../../../cards/src/cards/OP14EB04/characters/107-shakuyaku.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-107 Shakuyaku", () => {
  test("at three opposing Life draws two before its controller trashes exactly two physical hand cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Shakuyaku107, eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op14eb04Shakuyaku107.cost,
      },
      { life: [eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const initialHandId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op14eb04Shakuyaku107, "south");
    const decision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    expect(decision.actorId).toBe("south");
    const trash = decision.steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Shakuyaku's hand trash.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([initialHandId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [initialHandId, firstDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([initialHandId, firstDrawId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([secondDrawId]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("at four opposing Life does not draw or trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Shakuyaku107, eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04Shakuyaku107.cost,
      },
      { life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const handId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const deckCount = engine.getView("south").players.south.deckCount;

    engine.playCard(op14eb04Shakuyaku107, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([handId]);
    expect(view.players.south.deckCount).toBe(deckCount);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger with an included Kuja Pirates Leader plays the resolving physical card", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op07BoaHancock038,
        life: [op14eb04Shakuyaku107, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Shakuyaku107);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger cannot play Shakuyaku without a Kuja Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Shakuyaku107, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Shakuyaku107);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
