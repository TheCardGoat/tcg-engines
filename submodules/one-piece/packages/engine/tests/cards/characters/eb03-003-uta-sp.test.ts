import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02FakeStrawHatCrew005,
  eb02Uta001,
  eb03UtaSp003,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-003 Uta (SP)", () => {
  test("draws two with an Uta Leader, then plays only an effectless power-6000-or-less Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02Uta001,
      hand: [eb03UtaSp003, eb01Doma005, eb02FakeStrawHatCrew005, eb01MountainGod018],
      deck: [eb02FakeStrawHatCrew005, eb01MountainGod018],
      activeDon: 5,
    });
    const vanillaId = engine.findCardInZone("south", "hand", eb01Doma005);
    const effectfulId = engine.findCardInZone("south", "hand", eb02FakeStrawHatCrew005);
    const tooPowerfulId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.playCard(eb03UtaSp003, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Uta's effectless play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([vanillaId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(effectfulId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [vanillaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(0);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(vanillaId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
