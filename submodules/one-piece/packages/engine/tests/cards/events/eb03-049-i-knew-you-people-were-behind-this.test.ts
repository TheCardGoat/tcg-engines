import { describe, expect, test } from "vite-plus/test";
import {
  eb03IKnewYouPeopleWereBehindThis049,
  op06DrHogback090,
  op06Perona021,
  op07GeckoMoria042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { defineAutomaticLeaderCounterTest } from "./automatic-leader-counter.shared.ts";

describe("EB03-049 I Knew You People Were Behind This.", () => {
  test("pays both Main costs and maps the two ordered Thriller Bark play choices", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Perona021,
      hand: [eb03IKnewYouPeopleWereBehindThis049, op07GeckoMoria042],
      trash: [op06DrHogback090],
      activeDon: 8,
    });
    const eventId = engine.findCardInZone("south", "hand", eb03IKnewYouPeopleWereBehindThis049);
    const firstPlayId = engine.findCardInZone("south", "hand", op07GeckoMoria042);
    const secondPlayId = engine.findCardInZone("south", "trash", op06DrHogback090);

    engine.playCard(eb03IKnewYouPeopleWereBehindThis049);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const firstDecision = engine.pendingDecision("effectPlaySelection", "south");
    const firstStep = firstDecision.steps[0];
    expect(firstStep?.kind).toBe("selectEntity");
    if (firstStep?.kind !== "selectEntity") {
      throw new Error("Expected Perona's controller to receive the first Character play choice.");
    }
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstPlayId,
      secondPlayId,
    ]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [firstPlayId] }, "south");

    const secondDecision = engine.pendingDecision("effectPlaySelection", "south");
    const secondStep = secondDecision.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") {
      throw new Error("Expected Perona's controller to receive the second Character play choice.");
    }
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toEqual([secondPlayId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [secondPlayId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === firstPlayId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === secondPlayId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 8 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  defineAutomaticLeaderCounterTest(eb03IKnewYouPeopleWereBehindThis049);

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Perona021,
      hand: [eb03IKnewYouPeopleWereBehindThis049, op07GeckoMoria042],
      trash: [op06DrHogback090],
      activeDon: 8,
    });
    engine.playCard(eb03IKnewYouPeopleWereBehindThis049, "south");
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
