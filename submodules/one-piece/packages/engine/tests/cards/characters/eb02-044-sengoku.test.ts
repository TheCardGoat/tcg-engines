import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb02Komei034,
  eb02Sengoku044,
  op02Hina110,
  op02JaguarDSaul109,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-044 Sengoku", () => {
  test("plays an included Navy type rested from trash, then acts as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Sengoku044],
        trash: [op02JaguarDSaul109, eb02Komei034, op02Hina110],
        activeDon: 7,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const includedNavyId = engine.findCardInZone("south", "trash", op02JaguarDSaul109);
    const wrongColorId = engine.findCardInZone("south", "trash", eb02Komei034);
    const tooExpensiveId = engine.findCardInZone("south", "trash", op02Hina110);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb02Sengoku044, "south");
    const sengokuId = engine.findCardInZone("south", "character", eb02Sengoku044);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Sengoku's Navy play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([includedNavyId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [includedNavyId] }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === includedNavyId)?.rested,
    ).toBe(true);

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Sengoku's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", sengokuId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [sengokuId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      sengokuId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
