import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01OffWhite019,
  op01RoronoaZoro025,
  op08EdwardNewgate043,
  op08Marco002,
} from "@tcg/op-cards";

import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

function createEngine(northHand: Array<typeof eb01Doma005 | typeof eb01OffWhite019> = []) {
  return OnePieceTestEngine.create(
    {
      leaderCardId: op08Marco002,
      hand: [op08EdwardNewgate043],
      deck: 4,
      life: [eb01OffWhite019, eb01OffWhite019],
      activeDon: op08EdwardNewgate043.cost,
    },
    {
      hand: northHand,
      deck: 5,
      character: [
        { card: eb01Doma005, playedOnTurn: 0 },
        { card: eb01Fourtricks025, playedOnTurn: 0 },
      ],
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
}

describe("OP08-043 Edward.Newgate", () => {
  test("each selected existing Character trashes exactly two physical hand cards to attack", () => {
    const engine = createEngine([eb01Doma005, eb01Doma005, eb01OffWhite019]);

    engine.playCard(op08EdwardNewgate043, "south");
    engine.endTurn("south");

    const attackers = engine
      .getView("north")
      .players.north.characters.map((card) => card?.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));

    for (const attackerId of attackers) {
      engine.declareAttack(attackerId, engine.leader("south"), "north");
      const payment = engine.pendingDecision("battleAttackHandTrashCost", "north").steps[0];
      expect(payment).toMatchObject({ kind: "payCost", min: 2, max: 2 });
      if (payment?.kind !== "payCost") throw new Error("Expected the exact attack hand tax.");
      const paidIds = payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id);

      engine.resolveDecision("battleAttackHandTrashCost", { selectedIds: paidIds }, "north");

      expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
        expect.arrayContaining(paidIds),
      );
    }

    expect(engine.getView("north").players.north.handCount).toBe(0);
  });

  test("rejects a selected Character's attack when fewer than two hand cards remain", () => {
    const engine = createEngine([]);
    engine.playCard(op08EdwardNewgate043, "south");
    engine.endTurn("south");
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    expect(
      getLegalCommands(engine.getState(), "north").some(
        (command) => command.type === "declareAttack" && command.sourceId === attackerId,
      ),
    ).toBe(false);

    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId,
      targetId: engine.leader("south"),
    });

    expect(failure).toMatchObject({
      accepted: false,
      reason: "The attack requires trashing 2 card(s) from hand.",
    });
    expect(engine.getView("north").players.north.handCount).toBe(1);
  });

  test("does not tax a Rush Character played after selection", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Marco002,
        hand: [op08EdwardNewgate043],
        deck: 4,
        life: [eb01OffWhite019, eb01OffWhite019],
        activeDon: op08EdwardNewgate043.cost,
      },
      {
        hand: [op01RoronoaZoro025],
        deck: 5,
        activeDon: op01RoronoaZoro025.cost,
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op08EdwardNewgate043, "south");
    engine.endTurn("south");
    engine.playCard(op01RoronoaZoro025, "north");
    const newAttackerId = engine.findCardInZone("north", "character", op01RoronoaZoro025);

    engine.declareAttack(newAttackerId, engine.leader("south"), "north");

    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === newAttackerId)?.rested,
    ).toBe(true);
  });

  test("the selected Character attacks without the tax after the opponent's next turn", () => {
    const engine = createEngine([]);
    engine.playCard(op08EdwardNewgate043, "south");
    engine.endTurn("south");
    engine.endTurn("north");
    engine.endTurn("south");
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);
  });
});
