import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02FakeStrawHatCrew005,
  op06Uta001,
  eb03UtaSp003,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-003 Uta (SP)", () => {
  test("draws two with an Uta Leader, then plays only an effectless power-6000-or-less Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      hand: [eb03UtaSp003, eb01Doma005, eb02FakeStrawHatCrew005, eb01MountainGod018],
      deck: [eb02FakeStrawHatCrew005, eb01MountainGod018, "EB01-025"],
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
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(vanillaId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("a non-Uta Leader receives neither the draw nor the trailing play (FAQ Q1072)", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03UtaSp003, eb01Doma005],
      activeDon: 5,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;
    engine.playCard(eb03UtaSp003, "south");
    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.hand.map((card) => card.cardId)).toEqual([eb01Doma005.id]);
    expect(view.players.south.characters.filter(Boolean).map((card) => card?.cardId)).toEqual([
      eb03UtaSp003.id,
    ]);
    expect(view.prompts).toHaveLength(0);
  });
});
