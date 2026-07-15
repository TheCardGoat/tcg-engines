import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { todKnowsAllTheTricks } from "./092-tod-knows-all-the-tricks";
import { distract } from "../../003/actions/159-distract";
import { stolenScimitar } from "../../001/items/102-stolen-scimitar";
import { educationOrElimination } from "../actions/097-education-or-elimination";

describe("Tod - Knows All the Tricks", () => {
  describe("IMPRESSIVE LEAPS - Twice during your turn, whenever this character is chosen for an action or an item's ability, you may ready him.", () => {
    it("should ready Tod when targeted by an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todKnowsAllTheTricks, exerted: true, isDrying: false }],
        hand: [distract],
        inkwell: distract.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(true);

      // Play Distract targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();

      // IMPRESSIVE LEAPS triggers - accept the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Tod should be readied
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(false);
    });

    it("should allow declining the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todKnowsAllTheTricks, exerted: true, isDrying: false }],
        hand: [distract],
        inkwell: distract.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(true);

      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Tod should still be exerted
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(true);
    });

    it("should ready Tod when targeted by an item ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: todKnowsAllTheTricks, exerted: true, isDrying: false },
          { card: stolenScimitar, isDrying: false },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(true);

      // Activate Stolen Scimitar targeting Tod
      expect(
        testEngine.asPlayerOne().activateAbility(stolenScimitar, {
          ability: "SLASH",
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();

      // IMPRESSIVE LEAPS triggers - accept it
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Tod should be readied
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(false);
    });

    it("should allow triggering twice per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: todKnowsAllTheTricks, exerted: true, isDrying: false },
          { card: stolenScimitar, isDrying: false },
        ],
        hand: [distract],
        inkwell: distract.cost,
        deck: 5,
      });

      // First trigger: action targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId1 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(false);

      // Exert Tod again via quest
      expect(testEngine.asPlayerOne().quest(todKnowsAllTheTricks)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(true);

      // Second trigger: item ability targeting Tod
      expect(
        testEngine.asPlayerOne().activateAbility(stolenScimitar, {
          ability: "SLASH",
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId2 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(false);
    });

    it("regression: triggers when chosen via a choice-effect action (Education or Elimination)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todKnowsAllTheTricks, exerted: true, isDrying: false }],
        hand: [educationOrElimination],
        inkwell: educationOrElimination.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(true);

      // Play Education or Elimination, option 0: buff chosen character of yours (Tod)
      expect(
        testEngine.asPlayerOne().playCardWithChoice(educationOrElimination, 0, {
          targets: [todKnowsAllTheTricks],
        }).success,
      ).toBe(true);

      // IMPRESSIVE LEAPS must fire because Tod was chosen by an action
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricks)).toBe(false);
    });

    it("should not trigger a third time per turn", () => {
      const secondDistract = { ...distract, id: "distract-2" };
      const thirdDistract = { ...distract, id: "distract-3" };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todKnowsAllTheTricks, isDrying: false }],
        hand: [distract, secondDistract, thirdDistract],
        inkwell: distract.cost * 3,
        deck: 10,
      });

      // First trigger: play Distract targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId1 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks),
      ).toBeSuccessfulCommand();

      // Second trigger: play another Distract targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(secondDistract, {
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId2 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricks),
      ).toBeSuccessfulCommand();

      // Third action: should NOT trigger IMPRESSIVE LEAPS (limit reached)
      expect(
        testEngine.asPlayerOne().playCard(thirdDistract, {
          targets: [todKnowsAllTheTricks],
        }),
      ).toBeSuccessfulCommand();

      // No bag effect should be created for IMPRESSIVE LEAPS
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
