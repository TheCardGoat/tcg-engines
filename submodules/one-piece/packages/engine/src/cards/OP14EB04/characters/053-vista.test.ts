import {
  eb01Doma005,
  eb01MountainGod018,
  op13PortgasDAce002,
  op06HodyJones020,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Vista053 } from "../../../../../cards/src/cards/characters/op14-053-vista.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-053 Vista", () => {
  test.each([
    ["OP15-092", "OP14-053"],
    ["OP14-053", "OP15-092"],
  ])(
    "copies the continuously modified Leader base power with source order %s then %s",
    (first, second) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: "OP10-042",
          character: [first, second],
          trash: Array.from({ length: 20 }, () => "EB01-005"),
        },
        { character: [{ cardId: "ST01-012", playedOnTurn: 0 }] },
      );
      const vista = engine.findCardInZone("south", "character", "OP14-053");
      engine.asSouth().endTurn();
      expect(engine.getView("south").players.south.leader.power).toBe(7000);
      expect(
        engine.getView("south").players.south.characters.find((c) => c?.instanceId === vista)
          ?.power,
      ).toBe(7000);
      engine.asNorth().attack("ST01-012", engine.leader("south"));
      engine.asSouth().chooseBlocker(vista);
      expect(
        engine.getView("south").players.south.characters.find((c) => c?.instanceId === vista)
          ?.rested,
      ).toBe(true);
      expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).not.toContain(
        vista,
      );
      expect(engine.getView("south").prompts).toHaveLength(0);
      engine.asNorth().endTurn();
      expect(engine.getView("south").players.south.leader.power).toBe(5000);
      expect(
        engine.getView("south").players.south.characters.find((c) => c?.instanceId === vista)
          ?.power,
      ).toBe(4000);
    },
  );

  test("copies base power without the Leader's additive Counter power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP10-042",
        character: ["OP15-092", "OP14-053"],
        trash: Array.from({ length: 20 }, () => "EB01-005"),
        hand: ["ST03-017", "ST03-004"],
        activeDon: 2,
      },
      { character: [{ cardId: "ST01-012", playedOnTurn: 0 }] },
    );
    const vista = engine.findCardInZone("south", "character", "OP14-053");
    engine.asSouth().endTurn();
    engine.asNorth().attack("ST01-012", engine.leader("south"));
    engine.asSouth().chooseBlocker(null);
    engine.asSouth().chooseCounter("ST03-017");
    engine.asSouth().chooseTargets(engine.leader("south"));
    expect(engine.getView("south").players.south.leader.power).toBe(11000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === vista)?.power,
    ).toBe(7000);
    engine.asSouth().chooseCounter();
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("updates the copied base immediately when the source aura leaves the field", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP10-042",
        character: ["OP15-092", "OP14-053"],
        trash: Array.from({ length: 20 }, () => "EB01-005"),
      },
      { hand: ["OP04-056"], activeDon: 6 },
    );
    const vista = engine.findCardInZone("south", "character", "OP14-053");
    const luffy = engine.findCardInZone("south", "character", "OP15-092");
    engine.asSouth().endTurn();
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === vista)?.power,
    ).toBe(7000);
    engine.asNorth().play("OP04-056");
    engine.asNorth().chooseTargets(luffy);
    expect(
      engine.getView("south").players.south.characters.map((c) => c?.instanceId),
    ).not.toContain(luffy);
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === vista)?.power,
    ).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Ace observes Vista's copied 6000 base power when Vista is K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13PortgasDAce002,
        character: [op14eb04Vista053],
        activeDon: 1,
        hand: [],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], hand: [] },
    );
    const vistaId = engine.findCardInZone("south", "character", op14eb04Vista053);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    engine.asSouth().attachDon(engine.leader("south"), 1);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === vistaId)
        ?.power,
    ).toBe(6000);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [vistaId] }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      vistaId,
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("copies its Leader's base power only on the opponent's turn with seven or fewer hand cards", () => {
    const threshold = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [op14eb04Vista053],
        hand: Array.from({ length: 7 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vistaId = threshold.findCardInZone("south", "character", op14eb04Vista053);
    expect(
      threshold
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === vistaId)?.power,
    ).toBe(op06HodyJones020.power);

    threshold.endTurn("north");
    expect(
      threshold
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === vistaId)?.power,
    ).toBe(op14eb04Vista053.power);

    const aboveThreshold = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [op14eb04Vista053],
        hand: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aboveId = aboveThreshold.findCardInZone("south", "character", op14eb04Vista053);
    expect(
      aboveThreshold
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === aboveId)?.power,
    ).toBe(op14eb04Vista053.power);
  });

  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Vista053] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vistaId = engine.findCardInZone("south", "character", op14eb04Vista053);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Vista's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(vistaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [vistaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(vistaId);
    expect(view.prompts).toHaveLength(0);
  });
});
