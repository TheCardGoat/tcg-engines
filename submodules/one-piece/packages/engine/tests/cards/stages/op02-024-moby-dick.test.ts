import { describe, expect, test } from "vite-plus/test";
import {
  eb02MerryGo060,
  op02EdwardNewgate004,
  op02MobyDick024,
  op03Namule007,
  op13Higuma013,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-024 Moby Dick", () => {
  test("dynamically gives Edward.Newgate and Whitebeard Pirates Characters +2000 during its controller's turn at 1 Life", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02MobyDick024],
      life: [op13Otama043],
      character: [op02EdwardNewgate004, op03Namule007, op13Otama043],
      activeDon: 2,
    });
    engine.playCard(op02MobyDick024);

    const edwardId = engine.findCardInZone("south", "character", op02EdwardNewgate004);
    const whitebeardPirateId = engine.findCardInZone("south", "character", op03Namule007);
    const unrelatedId = engine.findCardInZone("south", "character", op13Otama043);
    let characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === edwardId)?.power).toBe(12000);
    expect(characters.find((card) => card?.instanceId === whitebeardPirateId)?.power).toBe(7000);
    expect(characters.find((card) => card?.instanceId === unrelatedId)?.power).toBe(0);

    engine.endTurn("south");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === edwardId)?.power).toBe(10000);
    expect(characters.find((card) => card?.instanceId === whitebeardPirateId)?.power).toBe(5000);

    engine.endTurn("north");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === edwardId)?.power).toBe(12000);
    expect(characters.find((card) => card?.instanceId === whitebeardPirateId)?.power).toBe(7000);

    const highLifeEngine = OnePieceTestEngine.create({
      hand: [op02MobyDick024],
      life: [op13Otama043, op13Higuma013],
      character: [op03Namule007],
      activeDon: 2,
    });
    highLifeEngine.playCard(op02MobyDick024);
    expect(highLifeEngine.getView("south").players.south.characters[0]?.power).toBe(5000);
  });

  test("lets the defending player use its Life Trigger to play it without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        life: [op02MobyDick024],
        stage: eb02MerryGo060,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);
    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    expect(triggerDecision).toMatchObject({
      actorId: "north",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: triggerDecision.id },
    });
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.stage?.cardId).toBe(op02MobyDick024.id);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(eb02MerryGo060.id);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
