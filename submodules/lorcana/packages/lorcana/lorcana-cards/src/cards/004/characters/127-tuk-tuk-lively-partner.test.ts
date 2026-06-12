import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { sugarRushSpeedwayFinishLine } from "../../006/locations/035-sugar-rush-speedway-finish-line";
import { tukTukLivelyPartner } from "./127-tuk-tuk-lively-partner";

const allyCharacter = createMockCharacter({
  id: "tuk-tuk-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherAlly = createMockCharacter({
  id: "tuk-tuk-test-another-ally",
  name: "Another Ally",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const simpleLocation = createMockLocation({
  id: "tuk-tuk-test-location",
  name: "Simple Location",
  cost: 2,
  moveCost: 1,
  willpower: 6,
  lore: 1,
  abilities: [],
});

describe("Tuk Tuk - Lively Partner", () => {
  it("has correct stats", () => {
    expect(tukTukLivelyPartner.cost).toBe(3);
    expect(tukTukLivelyPartner.strength).toBe(2);
    expect(tukTukLivelyPartner.willpower).toBe(3);
    expect(tukTukLivelyPartner.lore).toBe(1);
  });

  it("has Evasive keyword ability", () => {
    const abilities = tukTukLivelyPartner.abilities ?? [];
    const hasEvasive = abilities.some(
      (ability) =>
        ability.type === "keyword" &&
        "keyword" in ability &&
        typeof (ability as { keyword: string }).keyword === "string" &&
        (ability as { keyword: string }).keyword.toLowerCase() === "evasive",
    );
    expect(hasEvasive).toBe(true);
  });

  it("is inkable", () => {
    expect(tukTukLivelyPartner.inkable).toBe(true);
  });

  describe("ON A ROLL - When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 Strength this turn.", () => {
    it("moves Tuk Tuk and another chosen character to the same location when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tukTukLivelyPartner],
        inkwell: tukTukLivelyPartner.cost,
        play: [allyCharacter, simpleLocation],
      });

      expect(testEngine.asPlayerOne().playCard(tukTukLivelyPartner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tukTukLivelyPartner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [allyCharacter, simpleLocation],
        }),
      ).toBeSuccessfulCommand();

      // Both Tuk Tuk and ally should be at the location
      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: tukTukLivelyPartner,
        location: simpleLocation,
      });
      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: allyCharacter,
        location: simpleLocation,
      });
    });

    it("gives the other character +2 Strength this turn when the ability resolves", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tukTukLivelyPartner],
        inkwell: tukTukLivelyPartner.cost,
        play: [allyCharacter, simpleLocation],
      });

      expect(testEngine.asPlayerOne().playCard(tukTukLivelyPartner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tukTukLivelyPartner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [allyCharacter, simpleLocation],
        }),
      ).toBeSuccessfulCommand();

      // The ally should have +2 Strength (from 2 to 4)
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(
        allyCharacter.strength + 2,
      );
      // Tuk Tuk should NOT get the +2 Strength bonus
      expect(testEngine.asPlayerOne().getCard(tukTukLivelyPartner).strength).toBe(
        tukTukLivelyPartner.strength,
      );
    });

    it("does nothing when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tukTukLivelyPartner],
        inkwell: tukTukLivelyPartner.cost,
        play: [allyCharacter, simpleLocation],
      });

      expect(testEngine.asPlayerOne().playCard(tukTukLivelyPartner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tukTukLivelyPartner, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Neither character should be at the location
      const tukTukCard = testEngine.asPlayerOne().getCard(tukTukLivelyPartner);
      expect(tukTukCard.atLocationId).toBeUndefined();
      const allyCard = testEngine.asPlayerOne().getCard(allyCharacter);
      expect(allyCard.atLocationId).toBeUndefined();

      // No strength bonus
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(allyCharacter.strength);
    });

    it("can still be played when there are no other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tukTukLivelyPartner],
        inkwell: tukTukLivelyPartner.cost,
        play: [simpleLocation],
      });

      expect(testEngine.asPlayerOne().playCard(tukTukLivelyPartner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(tukTukLivelyPartner)).toBe("play");
    });

    it("gives +2 Strength only for this turn (buff expires next turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tukTukLivelyPartner],
          inkwell: tukTukLivelyPartner.cost,
          play: [allyCharacter, simpleLocation],
        },
        {
          deck: 10,
        },
      );

      expect(testEngine.asPlayerOne().playCard(tukTukLivelyPartner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tukTukLivelyPartner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [allyCharacter, simpleLocation],
        }),
      ).toBeSuccessfulCommand();

      // Verify +2 Strength is active this turn
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(
        allyCharacter.strength + 2,
      );

      // Pass turn and return - strength should be back to normal
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // After the turn ends, the buff should be gone
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(allyCharacter.strength);
    });

    it("works with multiple characters in play - only the chosen one gets +2 Strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tukTukLivelyPartner],
        inkwell: tukTukLivelyPartner.cost,
        play: [allyCharacter, anotherAlly, simpleLocation],
      });

      expect(testEngine.asPlayerOne().playCard(tukTukLivelyPartner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tukTukLivelyPartner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [allyCharacter, simpleLocation],
        }),
      ).toBeSuccessfulCommand();

      // Only allyCharacter gets the buff (it was chosen)
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(
        allyCharacter.strength + 2,
      );
      // anotherAlly should NOT have a buff
      expect(testEngine.asPlayerOne().getCard(anotherAlly).strength).toBe(anotherAlly.strength);
    });

    it("does NOT trigger Sugar Rush Speedway's BRING IT HOME when Tuk Tuk moves to it from play (regression: bugrepIz1o2YYBcU4aBj_n2mOz6)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tukTukLivelyPartner],
        inkwell: tukTukLivelyPartner.cost,
        play: [allyCharacter, sugarRushSpeedwayFinishLine],
        deck: 10,
      });

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(tukTukLivelyPartner)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tukTukLivelyPartner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [allyCharacter, sugarRushSpeedwayFinishLine],
        }),
      ).toBeSuccessfulCommand();

      // Both should be at the location.
      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: tukTukLivelyPartner,
        location: sugarRushSpeedwayFinishLine,
      });
      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: allyCharacter,
        location: sugarRushSpeedwayFinishLine,
      });

      // BRING IT HOME, LITTLE ONE! requires a from-location move; neither
      // character was at a location before, so the trigger must not enter
      // the bag (no optional prompt) and lore must be unchanged.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
      expect(testEngine.asPlayerOne().getCardZone(sugarRushSpeedwayFinishLine)).toBe("play");
    });
  });
});
