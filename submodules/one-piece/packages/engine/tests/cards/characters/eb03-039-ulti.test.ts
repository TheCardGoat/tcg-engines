import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02FakeStrawHatCrew005,
  eb03Ulti039,
  op01Kaido061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-039 Ulti", () => {
  test("draws, maps the mandatory discard, then plays only an effectless power-6000-or-less Character from trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Kaido061,
      hand: [eb03Ulti039, eb02FakeStrawHatCrew005],
      deck: [eb01Fourtricks025, eb01Doma005],
      trash: [eb01Doma005, eb01MountainGod018, eb02FakeStrawHatCrew005],
      activeDon: 6,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb02FakeStrawHatCrew005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const vanillaId = engine.findCardInZone("south", "trash", eb01Doma005);
    const tooPowerfulId = engine.findCardInZone("south", "trash", eb01MountainGod018);
    const effectfulId = engine.findCardInZone("south", "trash", eb02FakeStrawHatCrew005);

    engine.playCard(eb03Ulti039, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") {
      throw new Error("Expected Ulti's mandatory hand-trash choice.");
    }
    expect(discard.min).toBe(1);
    expect(discard.max).toBe(1);
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toEqual([discardedId, drawnId]);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") {
      throw new Error("Expected Ulti's effectless Character play choice.");
    }
    expect(play.min).toBe(0);
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([vanillaId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(effectfulId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(discardedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [vanillaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(vanillaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw, trash, or play without an Animal Kingdom Pirates Leader", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Ulti039],
      deck: [eb01Fourtricks025, eb01Doma005],
      trash: [eb01Doma005],
      activeDon: 6,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const trashId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(eb03Ulti039, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(drawnId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(trashId);
    expect(view.prompts).toHaveLength(0);
  });
});
