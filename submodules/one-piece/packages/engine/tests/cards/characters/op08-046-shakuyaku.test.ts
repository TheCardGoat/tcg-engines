import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01OffWhite019,
  op08Shakuyaku046,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const returnOpponent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP08-046-RETURN",
  canonicalId: "TEST-OP08-046-RETURN",
  name: "Shakuyaku Removal Review",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToHand",
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

registerCards([returnOpponent]);

function removeWithEvent(engine: OnePieceTestEngine, targetId: string) {
  engine.playCard(returnOpponent, "south");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
}

describe("OP08-046 Shakuyaku", () => {
  test("once per turn makes the opponent bottom a chosen hand card after self-effect removal", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [returnOpponent, returnOpponent],
        character: [op08Shakuyaku046],
      },
      {
        hand: [eb01Doma005, eb01Doma005, eb01Fourtricks025, eb01Fourtricks025, eb01MountainGod018],
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const shakuyakuId = engine.findCardInZone("south", "character", op08Shakuyaku046);
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    removeWithEvent(engine, firstTargetId);
    const handChoice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(handChoice).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (handChoice?.kind !== "selectEntity") {
      throw new Error("Expected Shakuyaku's opponent-owned hand choice.");
    }
    const chosenId = handChoice.candidates[0]!.ref.id;
    const deckBefore = engine.getView("north").players.north.deckCount;
    engine.resolveDecision("effectTargetSelection", { selectedIds: [chosenId] }, "north");

    let view = engine.getView("south");
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === shakuyakuId)?.rested,
    ).toBe(true);

    removeWithEvent(engine, secondTargetId);
    view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.characters.some((card) => card?.instanceId === secondTargetId)).toBe(
      false,
    );
  });

  test("does not react when a Character is removed by battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op08Shakuyaku046, { card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01OffWhite019, eb01OffWhite019, eb01OffWhite019, eb01OffWhite019, eb01OffWhite019],
        character: [{ card: eb01Doma005, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shakuyakuId = engine.findCardInZone("south", "character", op08Shakuyaku046);
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, targetId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === shakuyakuId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not react below five opposing hand cards after the removal", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [returnOpponent], character: [op08Shakuyaku046] },
      { hand: [eb01Doma005, eb01Doma005], character: [eb01Doma005] },
    );
    const shakuyakuId = engine.findCardInZone("south", "character", op08Shakuyaku046);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    removeWithEvent(engine, targetId);

    const view = engine.getView("south");
    expect(view.players.north.handCount).toBe(3);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === shakuyakuId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
