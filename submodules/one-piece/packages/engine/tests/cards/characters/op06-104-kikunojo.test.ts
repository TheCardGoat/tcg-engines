import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06Kikunojo104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-104 Kikunojo", () => {
  test("on K.O. may add the top deck card to top Life when the opponent has 3 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op06Kikunojo104, rested: true }],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kikunojoId = engine.findCardInZone("south", "character", op06Kikunojo104);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const deckTopId = engine.getState().players.south.deck[0]!;

    engine.declareAttack(attackerId, kikunojoId, "north");

    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Kikunojo's Life choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      kikunojoId,
    );
  });

  test("on K.O. does not add Life when the opponent has 4 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op06Kikunojo104, rested: true }],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kikunojoId = engine.findCardInZone("south", "character", op06Kikunojo104);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = [...engine.getState().players.south.life];

    engine.declareAttack(attackerId, kikunojoId, "north");

    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger plays the resolving physical card when the opponent has 3 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { life: [op06Kikunojo104] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const kikunojoId = engine.findCardInZone("north", "life", op06Kikunojo104);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(kikunojoId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(kikunojoId);
  });

  test("Life Trigger trashes the card instead of playing it when the opponent has 4 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { life: [op06Kikunojo104] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const kikunojoId = engine.findCardInZone("north", "life", op06Kikunojo104);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(kikunojoId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(kikunojoId);
  });
});
