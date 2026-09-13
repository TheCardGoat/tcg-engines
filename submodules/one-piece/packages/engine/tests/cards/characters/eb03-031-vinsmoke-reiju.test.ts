import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03VinsmokeReiju031,
  op03SanjiSPilaf056,
  op04PageOne053,
  op05ItSAWasteOfHumanLife058,
  op12Sanji041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-031 Vinsmoke Reiju", () => {
  test("returns one DON!! to activate only a cost-7-or-less Event Main effect from trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [eb03VinsmokeReiju031],
      trash: [op03SanjiSPilaf056, op05ItSAWasteOfHumanLife058],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      character: [{ card: op04PageOne053, attachedDon: 1 }],
      activeDon: 6,
    });
    const eventId = engine.findCardInZone("south", "trash", op03SanjiSPilaf056);
    const excludedId = engine.findCardInZone("south", "trash", op05ItSAWasteOfHumanLife058);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(eb03VinsmokeReiju031, "south");

    engine.acceptLeadingOptional("south");
    const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") {
      throw new Error("Expected Reiju's DON!! −1 On Play cost.");
    }
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    engine.acceptLeadingOptional("south");
    const event = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(event?.kind).toBe("selectEntity");
    if (event?.kind !== "selectEntity") {
      throw new Error("Expected Reiju's Event-from-trash activation choice.");
    }
    expect(event.candidates.map((candidate) => candidate.ref.id)).toEqual([eventId]);
    expect(event.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("pays DON!! −1 with a non-Sanji Leader but does not activate an Event Main effect", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03VinsmokeReiju031],
      trash: [op03SanjiSPilaf056],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: 6,
    });
    const eventId = engine.findCardInZone("south", "trash", op03SanjiSPilaf056);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(eb03VinsmokeReiju031, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [eb03VinsmokeReiju031],
      trash: [op03SanjiSPilaf056, op05ItSAWasteOfHumanLife058],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      character: [{ card: op04PageOne053, attachedDon: 1 }],
      activeDon: 6,
    });

    engine.playCard(eb03VinsmokeReiju031, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
