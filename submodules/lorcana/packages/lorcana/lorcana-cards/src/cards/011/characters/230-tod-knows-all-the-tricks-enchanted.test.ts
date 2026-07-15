import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { todKnowsAllTheTricksEnchanted } from "./230-tod-knows-all-the-tricks-enchanted";
import { distract } from "../../003/actions/159-distract";
import { stolenScimitar } from "../../001/items/102-stolen-scimitar";

describe("Tod - Knows All the Tricks (Enchanted)", () => {
  describe("IMPRESSIVE LEAPS - Twice during your turn, whenever this character is chosen for an action or an item's ability, you may ready him.", () => {
    it("should ready Tod when targeted by an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todKnowsAllTheTricksEnchanted, exerted: true, isDrying: false }],
        hand: [distract],
        inkwell: distract.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(true);

      // Play Distract targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();

      // IMPRESSIVE LEAPS triggers - accept the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricksEnchanted, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Tod should be readied
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(false);
    });

    it("should allow declining the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todKnowsAllTheTricksEnchanted, exerted: true, isDrying: false }],
        hand: [distract],
        inkwell: distract.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(true);

      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricksEnchanted, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Tod should still be exerted
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(true);
    });

    it("should ready Tod when targeted by an item ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: todKnowsAllTheTricksEnchanted, exerted: true, isDrying: false },
          { card: stolenScimitar, isDrying: false },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(true);

      // Activate Stolen Scimitar targeting Tod
      expect(
        testEngine.asPlayerOne().activateAbility(stolenScimitar, {
          ability: "SLASH",
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();

      // IMPRESSIVE LEAPS triggers - accept it
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricksEnchanted, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Tod should be readied
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(false);
    });

    it("should allow triggering twice per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: todKnowsAllTheTricksEnchanted, exerted: true, isDrying: false },
          { card: stolenScimitar, isDrying: false },
        ],
        hand: [distract],
        inkwell: distract.cost,
        deck: 5,
      });

      // First trigger: action targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId1 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricksEnchanted),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(false);

      // Exert Tod again via quest
      expect(testEngine.asPlayerOne().quest(todKnowsAllTheTricksEnchanted)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(true);

      // Second trigger: item ability targeting Tod
      expect(
        testEngine.asPlayerOne().activateAbility(stolenScimitar, {
          ability: "SLASH",
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId2 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricksEnchanted),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(todKnowsAllTheTricksEnchanted)).toBe(false);
    });

    it("should not trigger a third time per turn", () => {
      const secondDistract = { ...distract, id: "distract-2" };
      const thirdDistract = { ...distract, id: "distract-3" };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todKnowsAllTheTricksEnchanted, isDrying: false }],
        hand: [distract, secondDistract, thirdDistract],
        inkwell: distract.cost * 3,
        deck: 10,
      });

      // First trigger: play Distract targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(distract, {
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId1 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricksEnchanted),
      ).toBeSuccessfulCommand();

      // Second trigger: play another Distract targeting Tod
      expect(
        testEngine.asPlayerOne().playCard(secondDistract, {
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      const bagId2 = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(todKnowsAllTheTricksEnchanted),
      ).toBeSuccessfulCommand();

      // Third action: should NOT trigger IMPRESSIVE LEAPS (limit reached)
      expect(
        testEngine.asPlayerOne().playCard(thirdDistract, {
          targets: [todKnowsAllTheTricksEnchanted],
        }),
      ).toBeSuccessfulCommand();

      // No bag effect should be created for IMPRESSIVE LEAPS
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
