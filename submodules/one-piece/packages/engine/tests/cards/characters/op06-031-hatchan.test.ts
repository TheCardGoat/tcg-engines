import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op06Camie025,
  op06Hammond032,
  op06Hatchan031,
  op06Hyouzou034,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-031 Hatchan", () => {
  test("Life Trigger plays only a cost-3-or-less Fish-Man or Merfolk from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op06Hatchan031],
        hand: [op06Camie025, op06Hammond032, op06Hyouzou034, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const hatchanId = engine.findCardInZone("north", "life", op06Hatchan031);
    const merfolkId = engine.findCardInZone("north", "hand", op06Camie025);
    const fishManId = engine.findCardInZone("north", "hand", op06Hammond032);
    const tooExpensiveId = engine.findCardInZone("north", "hand", op06Hyouzou034);
    const wrongTraitId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Hatchan's Trigger play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([merfolkId, fishManId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([tooExpensiveId, wrongTraitId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [fishManId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(fishManId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(hatchanId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(hatchanId);
    expect(view.prompts).toHaveLength(0);
  });
});
