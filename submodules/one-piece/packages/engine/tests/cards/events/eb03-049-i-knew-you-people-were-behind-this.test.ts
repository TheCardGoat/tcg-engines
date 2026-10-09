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
  test("a non-Perona Leader can pay seven DON!! but plays neither eligible Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03IKnewYouPeopleWereBehindThis049, op07GeckoMoria042],
      trash: [op06DrHogback090],
      activeDon: 8,
    });
    engine.asSouth().play(eb03IKnewYouPeopleWereBehindThis049);
    engine.asSouth().acceptOptional();
    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 8 });
    expect(view.players.south.hand.map((card) => card.cardId)).toContain(op07GeckoMoria042.id);
    expect(view.players.south.trash.map((card) => card.cardId)).toEqual([
      op06DrHogback090.id,
      eb03IKnewYouPeopleWereBehindThis049.id,
    ]);
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("pays both Main costs and selects both Thriller Bark Characters before playing them active", () => {
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

    const firstDecision = engine.pendingDecision("effectGroupedPlaySelection", "south");
    const firstStep = firstDecision.steps[0];
    expect(firstStep?.kind).toBe("selectEntity");
    if (firstStep?.kind !== "selectEntity") {
      throw new Error("Expected Perona's controller to receive the first Character play choice.");
    }
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstPlayId,
      secondPlayId,
    ]);
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [firstPlayId, secondPlayId] },
      "south",
    );
    expect(
      engine
        .getView("south")
        .players.south.characters.filter(Boolean)
        .every((card) => card?.rested === false),
    ).toBe(true);

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

  test("fixes both physical selections before full-field replacement can add a new trash candidate", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: op06Perona021,
      hand: [eb03IKnewYouPeopleWereBehindThis049, op07GeckoMoria042],
      trash: [op06DrHogback090],
      character: [op06DrHogback090, "EB01-005", "EB01-005", "EB01-005", "EB01-005"],
      activeDon: 8,
    });
    const first = engine.findCardInZone("south", "hand", op07GeckoMoria042);
    const second = engine.findCardInZone("south", "trash", op06DrHogback090);
    const fieldHogback = engine.findCardInZone("south", "character", op06DrHogback090);
    const fieldDoma = engine.findCardInZone("south", "character", "EB01-005");
    engine.playCard(eb03IKnewYouPeopleWereBehindThis049);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const selection = engine.pendingDecision("effectGroupedPlaySelection", "south");
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: selection.id,
      selectedIds: [first, fieldHogback],
    });
    expect(engine.pendingDecision("effectGroupedPlaySelection", "south").id).toBe(selection.id);
    engine.resolveDecision("effectGroupedPlaySelection", { selectedIds: [first, second] }, "south");
    expect(engine.getState().players.south.hand).toContain(first);
    expect(engine.getState().players.south.trash).toContain(second);
    engine.resolveDecision(
      "effectPlayCharacterReplacement",
      { selectedIds: [fieldHogback] },
      "south",
    );
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectPlayCharacterReplacement", { selectedIds: [fieldDoma] }, "south");
    const field = engine.getView("south").players.south.characters;
    expect(field.find((card) => card?.instanceId === first)?.rested).toBe(false);
    expect(field.find((card) => card?.instanceId === second)?.rested).toBe(false);
    expect(engine.getState().players.south.trash).toContain(fieldHogback);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each([0, 1])("may select %s Characters with no play-state assignment", (amount) => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Perona021,
      hand: [eb03IKnewYouPeopleWereBehindThis049, op07GeckoMoria042],
      activeDon: 8,
    });
    const id = engine.findCardInZone("south", "hand", op07GeckoMoria042);
    engine.playCard(eb03IKnewYouPeopleWereBehindThis049);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: amount === 1 ? [id] : [] },
      "south",
    );
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(amount);
    if (amount === 1)
      expect(
        engine.getView("south").players.south.characters.find((card) => card?.instanceId === id)
          ?.rested,
      ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
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
