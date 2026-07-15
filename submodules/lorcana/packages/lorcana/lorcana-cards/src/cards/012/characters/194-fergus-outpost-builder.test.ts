import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { fergusOutpostBuilder } from "./194-fergus-outpost-builder";

const cheapLocation = createMockLocation({
  id: "fergus-cheap-location",
  name: "Cheap Outpost",
  cost: 4,
  willpower: 5,
  lore: 1,
});

const expensiveLocation = createMockLocation({
  id: "fergus-expensive-location",
  name: "Expensive Outpost",
  cost: 5,
  willpower: 5,
  lore: 1,
});

const otherLocation = createMockLocation({
  id: "fergus-other-location",
  name: "Other Location",
  cost: 3,
  willpower: 1,
  lore: 1,
});

const attacker = createMockCharacter({
  id: "fergus-attacker",
  name: "Attacker",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
});

const target = createMockCharacter({
  id: "fergus-target",
  name: "Target",
  cost: 2,
  strength: 1,
  willpower: 5,
  lore: 1,
});

describe("Fergus - Outpost Builder", () => {
  describe("JUST THE SPOT - During your turn, whenever this character becomes exerted, you may play a location from your hand or discard with cost 4 or less for free.", () => {
    it("plays a cost-4 location from hand for free when Fergus becomes exerted on your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: fergusOutpostBuilder, isDrying: false }],
          hand: [cheapLocation],
          deck: 1,
        },
        {
          play: [{ card: attacker, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      // Fergus challenges, becoming exerted
      expect(
        testEngine.asPlayerOne().challenge(fergusOutpostBuilder, attacker),
      ).toBeSuccessfulCommand();

      // Resolve the optional 'may' to play the location for free
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fergusOutpostBuilder, {
          targets: [cheapLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapLocation)).toBe("play");
    });

    it("plays a location from discard for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: fergusOutpostBuilder, isDrying: false }],
          discard: [cheapLocation],
          deck: 1,
        },
        {
          play: [{ card: attacker, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(fergusOutpostBuilder, attacker),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fergusOutpostBuilder, {
          targets: [cheapLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapLocation)).toBe("play");
    });

    it("surfaces discard locations after accepting the optional when hand has no locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: fergusOutpostBuilder, isDrying: false }],
          discard: [cheapLocation],
          deck: 1,
        },
        {
          play: [{ card: attacker, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(fergusOutpostBuilder, attacker),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fergusOutpostBuilder, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      const selectionContext = bagEffect?.selectionContext;
      expect(selectionContext?.kind).toBe("target-selection");
      if (selectionContext?.kind !== "target-selection") {
        throw new Error("Expected Fergus to publish a location selection prompt");
      }

      const cheapLocationId = testEngine.findCardInstanceId(cheapLocation, "discard", PLAYER_ONE);
      expect(selectionContext.allowedZones).toEqual(expect.arrayContaining(["discard"]));
      expect(selectionContext.cardCandidateIds).toEqual(expect.arrayContaining([cheapLocationId]));
    });

    it("does not allow playing a location with cost 5 or more", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: fergusOutpostBuilder, isDrying: false }],
          hand: [expensiveLocation],
          deck: 1,
        },
        {
          play: [{ card: attacker, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(fergusOutpostBuilder, attacker),
      ).toBeSuccessfulCommand();

      // Attempt to play the too-expensive location should not put it in play.
      testEngine.asPlayerOne().resolvePendingByCard(fergusOutpostBuilder, {
        targets: [expensiveLocation],
      });

      expect(testEngine.asPlayerOne().getCardZone(expensiveLocation)).toBe("hand");
    });
  });

  describe("HOLD FAST - While this character is at a location, whenever a location is challenged and banished, you may deal 4 damage to chosen character.", () => {
    it("triggers when an opponent's location is challenged and banished while Fergus is at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            otherLocation,
            {
              card: fergusOutpostBuilder,
              isDrying: false,
              exerted: false,
              atLocation: otherLocation,
            },
            { card: attacker, isDrying: false, exerted: false },
          ],
          deck: 1,
        },
        {
          play: [{ card: cheapLocation, isDrying: false }, target],
          deck: 1,
        },
      );

      // Player one's attacker challenges player two's location.
      expect(testEngine.asPlayerOne().challenge(attacker, cheapLocation)).toBeSuccessfulCommand();

      // Hold Fast triggers — resolve and target the opposing character.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fergusOutpostBuilder, {
          targets: [target],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(target)).toBe(4);
    });

    it("does not trigger when Fergus is not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: fergusOutpostBuilder, isDrying: false, exerted: false },
            { card: attacker, isDrying: false, exerted: false },
          ],
          deck: 1,
        },
        {
          play: [{ card: cheapLocation, isDrying: false }, target],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, cheapLocation)).toBeSuccessfulCommand();

      // No Hold Fast trigger should be queued for Fergus.
      const triggers = testEngine.asPlayerOne().getBagEffects();
      const fergusTrigger = triggers.find(
        (effect) => effect.sourceId && effect.sourceId.includes("Ys5"),
      );
      expect(fergusTrigger).toBeUndefined();
    });
  });
});
