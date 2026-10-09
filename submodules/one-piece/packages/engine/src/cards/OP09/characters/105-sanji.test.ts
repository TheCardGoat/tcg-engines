import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Vegapunk097,
  op09Sanji105,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-105 Sanji", () => {
  test("Life Trigger adds the deck top to Life, then trashes two chosen hand cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07Vegapunk097,
        life: [op09Sanji105],
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const discardIds = engine
      .getView("north")
      .players.north.hand.map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));
    const lifeCardId = engine.findCardInZone("north", "deck", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(engine.getState().players.north.life).toEqual([lifeCardId]);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(discardIds),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("Life Trigger still adds Life with zero or one hand card and trashes only available cards", () => {
    for (const hand of [[], [eb01Doma005]]) {
      const engine = OnePieceTestEngine.create(
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        {
          leaderCardId: op07Vegapunk097,
          life: [op09Sanji105],
          hand,
          deck: [eb01Fourtricks025, eb01Doma005],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      engine
        .asSouth()
        .attack(
          engine.findCardInZone("south", "character", eb01MountainGod018),
          engine.leader("north"),
        );
      if (hand.length) engine.asNorth().chooseCounter();
      engine.asNorth().activateLifeTrigger();
      engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");
      expect(engine.getView("north").players.north.lifeCount).toBe(1);
      expect(engine.getView("north").players.north.hand).toHaveLength(0);
      expect(engine.getView("north").players.north.deckCount).toBe(1);
    }
  });

  test("Life Trigger does not apply when its printed Leader or Life gate fails", () => {
    for (const fixture of [{ leader: "ST01-001", life: 5 }]) {
      const engine = OnePieceTestEngine.create(
        { life: fixture.life, character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        {
          leaderCardId: fixture.leader,
          life: ["OP09-105"],
          deck: ["EB01-005", "EB01-005", "EB01-005", "EB01-005"],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const trigger = engine.findCardInZone("north", "life", "OP09-105");
      engine
        .asSouth()
        .attack(engine.findCardInZone("south", "character", "EB01-018"), engine.leader("north"));
      engine.asNorth().activateLifeTrigger();
      expect(engine.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
      expect(engine.getView("north").players.north.lifeCount).toBe(0);
      expect(engine.getView("north").players.north.deckCount).toBe(4);
      expect(engine.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(
        trigger,
      );
      expect(engine.getView("north").prompts).toHaveLength(0);
    }
  });
});
