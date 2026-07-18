import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02EmporioIvankov049, op05Karasu005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-005 Karasu", () => {
  test("a compound Revolutionary Army Leader enables the On Play Leader-or-Character choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EmporioIvankov049,
        hand: [op05Karasu005],
        activeDon: op05Karasu005.cost,
      },
      { character: [eb01Doma005] },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);
    const leaderId = engine.leader("north");

    engine.playCard(op05Karasu005, "south");
    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Karasu's On Play target.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([leaderId, characterId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.leader.power).toBe(4000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(3000);
  });

  test("When Attacking needs 7000 power but not a Revolutionary Army Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Karasu005, attachedDon: 2, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const karasuId = engine.findCardInZone("south", "character", op05Karasu005);
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(karasuId, engine.leader("north"), "south");
    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Karasu's attack target.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("north"), characterId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(2000);
  });

  test("does not activate When Attacking below 7000 power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Karasu005, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const karasuId = engine.findCardInZone("south", "character", op05Karasu005);
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(karasuId, engine.leader("north"), "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
