import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02Komille097,
  op04DonquixoteDoflamingo019,
  op04Giolla025,
  op04Sugar024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-024 Sugar", () => {
  test("on the opponent's turn lets its controller rest an opposing Character, then rests itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04DonquixoteDoflamingo019,
        character: [op04Sugar024, eb01Doma005],
      },
      {
        hand: [eb01Doma005],
        character: [{ card: op04Giolla025, playedOnTurn: 0 }],
        activeDon: eb01Doma005.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sugarId = engine.findCardInZone("south", "character", op04Sugar024);
    const ownCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const existingOpponentId = engine.findCardInZone("north", "character", op04Giolla025);
    const playedId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(eb01Doma005, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const step = target.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Sugar's opponent target.");
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([existingOpponentId, playedId]),
    );
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCharacterId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [playedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === playedId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === existingOpponentId)?.rested,
    ).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === sugarId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("must rest itself after choosing zero and triggers only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04DonquixoteDoflamingo019,
        character: [op04Sugar024],
      },
      { hand: [eb01Doma005, eb01Doma005], activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sugarId = engine.findCardInZone("south", "character", op04Sugar024);

    engine.playCard(eb01Doma005, "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sugarId)
        ?.rested,
    ).toBe(true);

    engine.playCard(eb01Doma005, "north");
    const view = engine.getView("south");
    expect(view.players.north.characters.filter((card) => card?.cardId === eb01Doma005.id)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rested: false }),
        expect.objectContaining({ rested: false }),
      ]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trigger opponent-play behavior without a Donquixote Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Sugar024] },
      { hand: [eb01Doma005], activeDon: eb01Doma005.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sugarId = engine.findCardInZone("south", "character", op04Sugar024);
    const playedId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(eb01Doma005, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === sugarId)?.rested).toBe(
      false,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === playedId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("On Play rests only an active opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Sugar024],
        character: [eb01Doma005],
        activeDon: op04Sugar024.cost,
      },
      {
        character: [
          { card: op04Giolla025, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op02Komille097, playedOnTurn: 0, rested: true },
        ],
      },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", op04Giolla025);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const alreadyRestedId = engine.findCardInZone("north", "character", op02Komille097);

    engine.playCard(op04Sugar024, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const step = target.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Sugar's On Play target.");
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(alreadyRestedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("On Play may choose zero without resting an eligible Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op04Sugar024], activeDon: op04Sugar024.cost },
      { character: [{ card: op04Giolla025, playedOnTurn: 0 }] },
    );
    const targetId = engine.findCardInZone("north", "character", op04Giolla025);

    engine.playCard(op04Sugar024, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
