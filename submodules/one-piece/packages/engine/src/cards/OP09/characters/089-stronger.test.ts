import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09MarshallDTeach081,
  op09Stronger089,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-089 Stronger", () => {
  test("pays both trash costs, draws, then gives an opposing Character minus 2 cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [op09Stronger089],
        hand: [eb01Doma005],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      { character: [eb01MountainGod018] },
    );
    const strongerId = engine.findCardInZone("south", "character", op09Stronger089);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.getState().players.south.deck[0]!;
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(strongerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Stronger's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([strongerId, paymentId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without the required Leader still pays both costs and reduces cost but does not draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op09Stronger089],
        hand: [eb01Doma005],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      { character: [eb01MountainGod018] },
    );
    const strongerId = engine.findCardInZone("south", "character", op09Stronger089);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(strongerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([strongerId, paymentId]),
    );
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 2 });
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without paying either cost or reducing a Character's cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [op09Stronger089],
        hand: [eb01Doma005],
        deck: [eb01MountainGod018],
      },
      { character: [eb01MountainGod018] },
    );
    const strongerId = engine.findCardInZone("south", "character", op09Stronger089);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(strongerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === strongerId)).toBe(
      true,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
