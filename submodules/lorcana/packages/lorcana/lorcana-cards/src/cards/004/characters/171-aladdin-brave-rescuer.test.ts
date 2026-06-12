import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { aladdinBraveRescuer } from "./171-aladdin-brave-rescuer";
import { aladdinResoluteSwordsman } from "./172-aladdin-resolute-swordsman";

const mockItem = createMockItem({
  id: "mock-item",
  name: "Mock Item",
  cost: 2,
});

const mockLocation = createMockLocation({
  id: "mock-location",
  name: "Mock Location",
  cost: 2,
});

describe("Aladdin - Brave Rescuer", () => {
  describe("Shift: Discard a location card", () => {
    it("can shift onto an Aladdin character by discarding a location card from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [aladdinResoluteSwordsman],
        hand: [mockLocation, aladdinBraveRescuer],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        aladdinResoluteSwordsman,
        "play",
        PLAYER_ONE,
      );
      const locationToDiscard = testEngine.findCardInstanceId(mockLocation, "hand", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(aladdinBraveRescuer, {
          cost: {
            cost: "shift",
            shiftTarget,
            discardCards: [locationToDiscard],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(aladdinBraveRescuer)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(mockLocation)).toBe("discard");
    });

    it("cannot shift without discarding a location card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [aladdinResoluteSwordsman],
        hand: [aladdinBraveRescuer],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        aladdinResoluteSwordsman,
        "play",
        PLAYER_ONE,
      );

      const result = testEngine.asPlayerOne().playCard(aladdinBraveRescuer, {
        cost: {
          cost: "shift",
          shiftTarget,
        },
      });

      expect(result.success).toBe(false);
    });
  });

  describe("CRASHING THROUGH - Whenever this character quests, you may banish chosen item.", () => {
    it("banishes chosen item when questing and accepting the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: aladdinBraveRescuer, isDrying: false }],
          deck: 3,
        },
        {
          play: [mockItem],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(aladdinBraveRescuer)).toBeSuccessfulCommand();

      // Resolve the triggered ability - accept optional and target the item
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aladdinBraveRescuer, { targets: [mockItem] }),
      ).toBeSuccessfulCommand();

      // Item should be banished
      expect(testEngine.asPlayerTwo().getCardZone(mockItem)).toBe("discard");

      // Should have gained lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(aladdinBraveRescuer.lore);
    });

    it("does not banish when declining the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: aladdinBraveRescuer, isDrying: false }],
          deck: 3,
        },
        {
          play: [mockItem],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(aladdinBraveRescuer)).toBeSuccessfulCommand();

      // Decline the optional ability
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(aladdinBraveRescuer, { resolveOptional: false });

      // Item should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(mockItem)).toBe("play");

      // Should still have gained lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(aladdinBraveRescuer.lore);
    });

    it("can target any item in play (including own items)", () => {
      const ownItem = createMockItem({
        id: "own-item",
        name: "Own Item",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinBraveRescuer, isDrying: false }, ownItem],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(aladdinBraveRescuer)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aladdinBraveRescuer, { targets: [ownItem] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
    });
  });
});
