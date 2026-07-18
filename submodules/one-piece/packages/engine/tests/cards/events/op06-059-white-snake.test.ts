import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op05BartholomewKuma011,
  op05Hack012,
  op05Sabo007,
  op06WhiteSnake059,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-059 White Snake", () => {
  test("Counter maps turn power and draws before resolving combat", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Hack012, playedOnTurn: 0 }],
      },
      {
        hand: [op06WhiteSnake059],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05Hack012);
    const eventId = engine.findCardInZone("north", "hand", op06WhiteSnake059);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger privately orders 5 cards and places the group at top or bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op06WhiteSnake059],
        deck: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          op01Hajrudin018,
          op05BartholomewKuma011,
          op05Sabo007,
        ],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const originalDeck = [...engine.getState().players.north.deck];
    const lookedIds = originalDeck.slice(0, 5);
    const chosenOrder = [...lookedIds].reverse();

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const orderDecision = engine.pendingDecision("effectRearrangeDeckOrder", "north");
    expect(orderDecision.steps[0]).toMatchObject({ kind: "orderItems" });
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "north");

    const positionDecision = engine.pendingDecision("effectRearrangeDeckPosition", "north");
    const positionStep = positionDecision.steps[0];
    expect(positionStep?.kind).toBe("chooseOption");
    if (positionStep?.kind !== "chooseOption") {
      throw new Error("Expected the top-or-bottom group placement choice.");
    }
    expect(positionStep.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "north");

    expect(engine.getState().players.north.deck).toEqual([
      ...originalDeck.slice(5),
      ...chosenOrder,
    ]);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
