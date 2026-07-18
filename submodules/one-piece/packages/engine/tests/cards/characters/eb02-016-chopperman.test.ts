import { describe, expect, test } from "vite-plus/test";
import {
  eb01TonyTonyChopper006,
  eb02Chopperman016,
  eb02TonyTonyChopper001,
  op08DrHiriluk016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-016 Chopperman", () => {
  test("plays a compound Animal and has Tony Tony.Chopper as a rules name", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02TonyTonyChopper001,
      hand: [eb02Chopperman016, eb01TonyTonyChopper006],
      character: [{ card: op08DrHiriluk016, playedOnTurn: 0 }],
      activeDon: 5,
    });
    const playedId = engine.findCardInZone("south", "hand", eb01TonyTonyChopper006);
    const hirilukId = engine.findCardInZone("south", "character", op08DrHiriluk016);

    engine.playCard(eb02Chopperman016, "south");
    const choppermanId = engine.findCardInZone("south", "character", eb02Chopperman016);
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Chopperman's Animal choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    engine.activateEffect(hirilukId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === choppermanId)?.power).toBe(8000);
    expect(characters.find((card) => card?.instanceId === playedId)?.power).toBe(6000);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
