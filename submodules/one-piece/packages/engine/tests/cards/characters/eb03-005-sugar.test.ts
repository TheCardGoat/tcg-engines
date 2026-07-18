import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb03Sugar005,
  op10DonquixoteDoflamingo071,
  op10DonquixoteRosinante072,
  op10Sugar003,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-005 Sugar", () => {
  test("plays a power-6000 compound Donquixote Pirates Character rested with a Sugar Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Sugar003,
      hand: [eb03Sugar005, op10DonquixoteRosinante072, op10DonquixoteDoflamingo071, eb01Doma005],
      activeDon: 3,
    });
    const legalId = engine.findCardInZone("south", "hand", op10DonquixoteRosinante072);
    const tooPowerfulId = engine.findCardInZone("south", "hand", op10DonquixoteDoflamingo071);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(eb03Sugar005, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Sugar's rested play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([legalId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [legalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === legalId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
