import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Crocodile062,
  op01MsAllSunday079,
  op01OfficerAgents087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-079 Ms. All Sunday", () => {
  test("blocks, then with a Baroque Works Leader returns only an Event after being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Crocodile062,
        character: [{ card: op01MsAllSunday079, playedOnTurn: 0 }],
        trash: [op01OfficerAgents087, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op01MsAllSunday079);
    const eventId = engine.findCardInZone("south", "trash", op01OfficerAgents087);
    const characterId = engine.findCardInZone("south", "trash", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Ms. All Sunday's Event recovery choice.");
    }
    expect(target.min).toBe(0);
    expect(target.max).toBe(1);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eventId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not recover an Event when its Leader lacks the Baroque Works type", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01MsAllSunday079, rested: true, playedOnTurn: 0 }],
        trash: [op01OfficerAgents087],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sundayId = engine.findCardInZone("south", "character", op01MsAllSunday079);
    const eventId = engine.findCardInZone("south", "trash", op01OfficerAgents087);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, sundayId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, sundayId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(eventId);
    expect(view.prompts).toHaveLength(0);
  });
});
