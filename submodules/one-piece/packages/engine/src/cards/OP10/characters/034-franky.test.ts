import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, eb01OffWhite019, op10Franky034 } from "@tcg/op-cards";

import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const effectKoFranky: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP10-034-KO",
  canonicalId: "TEST-OP10-034-KO",
  name: "Franky Effect K.O. Test",
  cost: 0,
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([effectKoFranky]);

describe("OP10-034 Franky", () => {
  test("once per turn takes the top Life into hand instead of its battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Franky034, rested: true }], life: [eb01Doma005] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const frankyId = engine.findCardInZone("south", "character", op10Franky034);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const attackers = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId);

    engine.declareAttack(attackers[0]!, frankyId, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === frankyId)).toBe(true);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);

    engine.declareAttack(attackers[1]!, frankyId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace an effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Franky034], life: [eb01Doma005] },
      { hand: [effectKoFranky] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const frankyId = engine.findCardInZone("south", "character", op10Franky034);

    engine.playCard(effectKoFranky, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frankyId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
