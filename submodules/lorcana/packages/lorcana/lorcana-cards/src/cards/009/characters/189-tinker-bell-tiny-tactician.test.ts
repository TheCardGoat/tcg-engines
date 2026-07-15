import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tinkerBellTinyTactician } from "./189-tinker-bell-tiny-tactician";

const drawnCard = createMockCharacter({
  id: "tink9-189-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "tink9-189-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const handCard = createMockCharacter({
  id: "tink9-189-hand-card",
  name: "Hand Card",
  cost: 1,
});

describe("Tinker Bell - Tiny Tactician (set9-189)", () => {
  describe("BATTLE PLANS {E} — Draw a card, then choose and discard a card.", () => {
    it("draws a card then forces a chosen discard when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [drawnCard],
        hand: [handCard, discardFodder],
        play: [{ card: tinkerBellTinyTactician, isDrying: false }],
      });

      // Activate BATTLE PLANS (exerts Tinker Bell)
      expect(
        testEngine.asPlayerOne().activateAbility(tinkerBellTinyTactician, {
          ability: "BATTLE PLANS",
        }),
      ).toBeSuccessfulCommand();

      // Tinker Bell should now be exerted
      expect(testEngine.asPlayerOne().isExerted(tinkerBellTinyTactician)).toBe(true);

      // The drawn card should now be in hand (draw step is automatic)
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");

      // A pending discard choice should be active — resolve it by discarding the fodder
      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [discardFodderId],
        }),
      ).toBeSuccessfulCommand();

      // discardFodder should be in discard; drawn card and handCard should remain in hand
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("hand");

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        hand: 2,
        discard: 1,
        play: 1,
      });
    });

    it("cannot activate BATTLE PLANS when Tinker Bell is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [drawnCard],
        hand: [discardFodder],
        play: [{ card: tinkerBellTinyTactician, exerted: true, isDrying: false }],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(tinkerBellTinyTactician, {
          ability: "BATTLE PLANS",
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("cannot activate BATTLE PLANS when Tinker Bell is still drying (just entered play)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [drawnCard],
        hand: [discardFodder],
        play: [{ card: tinkerBellTinyTactician, isDrying: true }],
      });

      // Character just entered play this turn — drying prevents activation
      expect(
        testEngine.asPlayerOne().activateAbility(tinkerBellTinyTactician, {
          ability: "BATTLE PLANS",
        }),
      ).not.toBeSuccessfulCommand();
    });
  });
});
