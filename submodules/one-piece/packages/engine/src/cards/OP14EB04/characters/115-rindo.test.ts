import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06GeckoMoria086,
  op07BoaHancock038,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Rindo115 } from "../../../../../cards/src/cards/OP14EB04/characters/115-rindo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-115 Rindo", () => {
  test("on the opponent's turn may add deck top to Life before taking it as damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Rindo115],
        life: [
          eb01Fourtricks025,
          eb01Fourtricks025,
          eb01Fourtricks025,
          eb01Fourtricks025,
          eb01Fourtricks025,
        ],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      {
        hand: [op12UrsaShock096],
        activeDon: op12UrsaShock096.cost,
        character: [op06GeckoMoria086],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rindoId = engine.findCardInZone("south", "character", op14eb04Rindo115);
    const deckTopId = engine.findCardInZone("south", "deck", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rindoId] }, "north");
    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Rindo's deck-to-Life count.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(deckTopId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rindoId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may add zero cards but still takes the following damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Rindo115],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      {
        hand: [op12UrsaShock096],
        activeDon: op12UrsaShock096.cost,
        character: [op06GeckoMoria086],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rindoId = engine.findCardInZone("south", "character", op14eb04Rindo115);
    const deckTopId = engine.findCardInZone("south", "deck", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rindoId] }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getState().players.south.deck[0]).toBe(deckTopId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger with an included Kuja Pirates Leader plays the resolving physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07BoaHancock038,
        life: [op14eb04Rindo115, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Rindo115);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
