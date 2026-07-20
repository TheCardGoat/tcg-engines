import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Crocodile062,
  op01OfficerAgents087,
  op01RoronoaZoro001,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Kumacy102 } from "../../../../../cards/src/cards/OP14EB04/characters/102-kumacy.ts";
import { op14eb04BoaHancockOp14112112 } from "../../../../../cards/src/cards/OP14EB04/characters/112-boa-hancock-op14-112.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-112 Boa Hancock", () => {
  test("with an included Seven Warlords Leader optionally moves own top deck to Life then opposing top Life to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Crocodile062,
        hand: [op14eb04BoaHancockOp14112112],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04BoaHancockOp14112112.cost,
      },
      {
        life: [eb01MountainGod018, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const ownTopDeckId = engine.findCardInZone("south", "deck", eb01Doma005);
    const opposingTopLifeId = engine.findCardInZone("north", "life", eb01MountainGod018);
    const ownLifeBefore = engine.getView("south").players.south.lifeCount;
    const opposingLifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op14eb04BoaHancockOp14112112, "south");
    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Boa's own Life choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    const removeLife = engine.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    if (removeLife?.kind !== "chooseOption")
      throw new Error("Expected Boa's opposing Life choice.");
    expect(removeLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    const southView = engine.getView("south");
    const northView = engine.getView("north");
    expect(southView.players.south.lifeCount).toBe(ownLifeBefore + 1);
    expect(engine.getState().players.south.life[0]).toBe(ownTopDeckId);
    expect(southView.players.north.lifeCount).toBe(opposingLifeBefore - 1);
    expect(northView.players.north.hand.map((card) => card.instanceId)).toContain(
      opposingTopLifeId,
    );
    expect(southView.prompts).toHaveLength(0);
  });

  test("a Leader without Seven Warlords performs neither Life movement", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        hand: [op14eb04BoaHancockOp14112112],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04BoaHancockOp14112112.cost,
      },
      { life: [eb01MountainGod018, eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const ownLife = engine.getView("south").players.south.lifeCount;
    const opposingLife = engine.getView("south").players.north.lifeCount;

    engine.playCard(op14eb04BoaHancockOp14112112, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(ownLife);
    expect(view.players.north.lifeCount).toBe(opposingLife);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger filters hand by Trigger, power, and Character category and disposes physical Boa", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04BoaHancockOp14112112, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        hand: [op14eb04Kumacy102, op14eb04BoaHancockOp14112112, eb01Doma005, op01OfficerAgents087],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04BoaHancockOp14112112);
    const eligibleId = engine.findCardInZone("north", "hand", op14eb04Kumacy102);
    const highPowerId = engine.findCardInZone("north", "hand", op14eb04BoaHancockOp14112112);
    const noTriggerId = engine.findCardInZone("north", "hand", eb01Doma005);
    const wrongCategoryId = engine.findCardInZone("north", "hand", op01OfficerAgents087);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Boa's Trigger play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    for (const excludedId of [highPowerId, noTriggerId, wrongCategoryId]) {
      expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    }
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
