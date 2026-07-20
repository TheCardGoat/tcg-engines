import { eb01Doma005, eb01MountainGod018, op06HodyJones020 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Vista053 } from "../../../../../cards/src/cards/OP14EB04/characters/053-vista.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-053 Vista", () => {
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
