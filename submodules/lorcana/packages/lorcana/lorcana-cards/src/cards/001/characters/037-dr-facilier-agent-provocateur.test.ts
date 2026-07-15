import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { drFacilierAgentProvocateur } from "./037-dr-facilier-agent-provocateur";
import { heiheiBoatSnack } from "./007-heihei-boat-snack";
import { mickeyMouseTrueFriend } from "./012-mickey-mouse-true-friend";
import { mauiHeroToAll } from "./114-maui-hero-to-all";

describe("Dr. Facilier - Agent Provocateur", () => {
  describe("INTO THE SHADOWS: Whenever one of your other characters is banished in a challenge, you may return that card to your hand.", () => {
    it("returns attacker character to hand when banished in challenge", () => {
      // Player one: Heihei (str=1,will=2) attacks Mickey (str=3,will=3)
      // Mickey's str=3 > Heihei's will=2 → Heihei is banished
      // Dr. Facilier (player one) watches → optional trigger fires → return Heihei to hand
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [heiheiBoatSnack, drFacilierAgentProvocateur],
          deck: 1,
        },
        {
          play: [{ card: mickeyMouseTrueFriend, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(heiheiBoatSnack, mickeyMouseTrueFriend),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(drFacilierAgentProvocateur, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(drFacilierAgentProvocateur)).toBe("play");
    });

    it("returns defender character to hand when banished in challenge", () => {
      // Player two: Heihei (str=1,will=2) is attacked by Mickey (str=3,will=3)
      // Mickey's str=3 > Heihei's will=2 → Heihei is banished
      // Dr. Facilier (player two) watches → optional trigger fires → return Heihei to player two's hand
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrueFriend],
          deck: 1,
        },
        {
          play: [{ card: heiheiBoatSnack, exerted: true }, drFacilierAgentProvocateur],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, heiheiBoatSnack),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(drFacilierAgentProvocateur, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(drFacilierAgentProvocateur)).toBe("play");
    });

    it("lets player decline the effect (character stays in discard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrueFriend],
          deck: 1,
        },
        {
          play: [{ card: heiheiBoatSnack, exerted: true }, drFacilierAgentProvocateur],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, heiheiBoatSnack),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(drFacilierAgentProvocateur, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(drFacilierAgentProvocateur)).toBe("play");
    });

    it("does not trigger when Dr. Facilier itself is banished in challenge", () => {
      // Maui (str=6) > Dr. Facilier (will=5) → Facilier is banished
      // The ability says "other characters" — self-banishment does not trigger
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mauiHeroToAll],
          deck: 1,
        },
        {
          play: [heiheiBoatSnack, { card: drFacilierAgentProvocateur, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mauiHeroToAll, drFacilierAgentProvocateur),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(drFacilierAgentProvocateur)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("play");
    });

    it("does not trigger when an opponent's character is banished (ability only watches own characters)", () => {
      // Player one: Mickey (attacker) and Dr. Facilier
      // Player two: Heihei (defender) — banished by Mickey
      // Dr. Facilier (player one) should NOT trigger because Heihei is not player one's character
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrueFriend, drFacilierAgentProvocateur],
          deck: 1,
        },
        {
          play: [{ card: heiheiBoatSnack, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, heiheiBoatSnack),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("discard");
    });

    it("does not trigger when a character is banished outside a challenge", () => {
      // Use manual lethal damage (not a challenge) to banish Heihei
      // The trigger only fires on challenge banishments
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [heiheiBoatSnack, drFacilierAgentProvocateur],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asServer().manualSetDamage(heiheiBoatSnack, heiheiBoatSnack.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("discard");
    });
  });
});
