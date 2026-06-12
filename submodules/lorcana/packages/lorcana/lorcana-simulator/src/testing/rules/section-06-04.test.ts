// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/06-abilities-effects-and-resolving.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  minnieMouseAlwaysClassy,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import {
  bashfulHopelessRomantic,
  grumpyBadtempered,
  happyGoodnatured,
  weightSet,
} from "@tcg/lorcana-cards/cards/002";
import { kidaProtectorOfAtlantis } from "@tcg/lorcana-cards/cards/003";
import { lefouOpportunisticFlunky } from "@tcg/lorcana-cards/cards/004";
import {
  anastasiaBossyStepsister,
  mufasaRespectedKing,
  restoringAtlantis,
} from "@tcg/lorcana-cards/cards/007";
import { arthurDeterminedSquire } from "@tcg/lorcana-cards/cards/008";

describe("# 6. ABILITIES, EFFECTS, AND RESOLVING", () => {
  describe("# 6.4. Static Abilities", () => {
    it("6.4.2.1. Restoring Atlantis protects characters already in play and characters played later that turn.", () => {
      // Example: Restoring Atlantis is an action with the effect, "Your characters can't be challenged until the start of your next turn." When the effect resolves, a continuous static effect is generated and continues to apply to all characters it could apply to until the duration ends. If a character is played after the effect resolves, that character is also affected by this continuous static effect.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [restoringAtlantis, minnieMouseAlwaysClassy],
          inkwell: restoringAtlantis.cost + minnieMouseAlwaysClassy.cost,
          play: [{ card: anastasiaBossyStepsister, exerted: true }],
          deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
        },
        {
          play: [mufasaRespectedKing],
          deck: [simbaProtectiveCub, arielOnHumanLegs],
        },
      );

      expect(testEngine.asPlayerOne().playCard(restoringAtlantis)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy)).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualExertCard(anastasiaBossyStepsister),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().canChallenge(mufasaRespectedKing, anastasiaBossyStepsister),
      ).toBe(false);
      expect(
        testEngine.asPlayerTwo().canChallenge(mufasaRespectedKing, minnieMouseAlwaysClassy),
      ).toBe(false);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      testEngine.asServer().manualExertCard(anastasiaBossyStepsister);
      testEngine.asServer().manualExertCard(minnieMouseAlwaysClassy);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().canChallenge(mufasaRespectedKing, anastasiaBossyStepsister),
      ).toBe(true);
      expect(
        testEngine.asPlayerTwo().canChallenge(mufasaRespectedKing, minnieMouseAlwaysClassy),
      ).toBe(true);
    });

    it("6.4.2.2. Kida only applies the -3 strength modifier to characters in play when the trigger resolves.", () => {
      // Example: Kida - Protector of Atlantis has an ability called Perhaps We Can Save Our Future that reads, "When you play this character, all characters get \(-3\) until the start of your next turn." When the triggered ability resolves, a static ability is generated that gives all characters \(-3\) until the start of the next turn. Because the effect applies to characters as it resolves, a character played after the static ability was generated isn't affected by the static ability.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kidaProtectorOfAtlantis, minnieMouseAlwaysClassy],
          inkwell: kidaProtectorOfAtlantis.cost + minnieMouseAlwaysClassy.cost,
          play: [grumpyBadtempered],
        },
        {
          play: [arthurDeterminedSquire],
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(grumpyBadtempered)).toBe(
        grumpyBadtempered.strength,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(arthurDeterminedSquire)).toBe(
        arthurDeterminedSquire.strength,
      );

      expect(testEngine.asPlayerOne().playCard(kidaProtectorOfAtlantis)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(kidaProtectorOfAtlantis)).toBe(0);
      expect(testEngine.asPlayerOne().getCardStrength(grumpyBadtempered)).toBe(0);
      expect(testEngine.asPlayerTwo().getCardStrength(arthurDeterminedSquire)).toBe(
        arthurDeterminedSquire.strength - 3,
      );

      expect(testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(minnieMouseAlwaysClassy)).toBe(
        minnieMouseAlwaysClassy.strength,
      );
    });

    it("6.4.2.3. Grumpy's static bonus applies on entry, lets Weight Set trigger", () => {
      // Example: A player has Weight Set and Grumpy - Bad-Tempered in play. Weight Set has an ability called Training that reads, "Whenever you play a character with 4 or more, you may pay 1 to draw a card." Grumpy has an ability called There's Trouble A-Brewin' that reads, "Your other Seven Dwarfs characters get +1." The player plays Happy - Good-Natured, which has 3. Happy comes into play with the static ability from Grumpy applying to him and has a value of 4. Because Happy is played with 4, the triggered ability on Weight Set occurs.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [happyGoodnatured],
          inkwell: 6,
          play: [weightSet, { card: grumpyBadtempered, exerted: true }],
          deck: [mickeyMouseTrueFriend],
        },
        {
          play: [arthurDeterminedSquire],
          deck: [simbaProtectiveCub],
        },
      );

      expect(testEngine.asPlayerOne().playCard(happyGoodnatured)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(happyGoodnatured)).toBe(
        happyGoodnatured.strength + 1,
      );
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toEqual(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toEqual(1);
    });

    it("6.4.4.1. Bashful can't quest while alone, but can once another Seven Dwarfs character is in play.", () => {
      //Example A: Bashful - Hopeless Romantic has an ability called Oh, Gosh! that reads, "This character can't quest unless you have another Seven Dwarfs character in play." The effect, "This character can't quest," applies and remains active for as long as the condition, "you have another Seven Dwarfs character in play," is false. Once the player has another Seven Dwarfs character in play, the condition is true, and the effect no longer applies.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [grumpyBadtempered],
        inkwell: 4,
        play: [bashfulHopelessRomantic],
      });

      expect(testEngine.asPlayerOne().quest(bashfulHopelessRomantic).success).toBe(false);
      expect(testEngine.asPlayerOne().playCard(grumpyBadtempered)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(bashfulHopelessRomantic)).toBeSuccessfulCommand();
    });

    describe("6.4.4.2. / 6.4.4.3. LeFou is only free during your turn after an opposing character was banished in a challenge that turn.", () => {
      it("Example B", () => {
        // Example B: Lefou - Opportunistic Flunky has an ability called I Learned from the Best that reads, "During your turn, you may play this character for free if an opposing character was banished in a challenge this turn." During your turn, the effect "you may play this character for free" applies for as long as the condition "an opposing character was banished in a challenge this turn" is true. If an opposing character hasn't been banished in a challenge during your turn, the condition is false, and the effect doesn't apply.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [lefouOpportunisticFlunky],
            play: [arthurDeterminedSquire],
            deck: [mickeyMouseTrueFriend],
          },
          {
            play: [{ card: simbaProtectiveCub, exerted: true }],
            deck: [arielOnHumanLegs],
          },
        );

        expect(testEngine.asPlayerOne().canPlayCard(lefouOpportunisticFlunky)).toBe(false);
        expect(testEngine.asPlayerOne().playCard(lefouOpportunisticFlunky).success).toBe(false);
        expect(
          testEngine.asPlayerOne().challenge(arthurDeterminedSquire, simbaProtectiveCub),
        ).toBeSuccessfulCommand();
        expect(
          testEngine.getAuthoritativeState().G.turnMetadata
            .banishedCharactersInChallengeByOwnerThisTurn[PLAYER_TWO],
        ).toBe(1);

        expect(testEngine.asPlayerOne().canPlayCard(lefouOpportunisticFlunky)).toBe(true);
        expect(testEngine.asPlayerOne().playCard(lefouOpportunisticFlunky)).toBeSuccessfulCommand();
        expect(testEngine.asPlayerOne().getCardZone(lefouOpportunisticFlunky)).toBe("play");
        expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(0);
      });
    });

    // Skipped as we don't have a way to simulate this behavior using real game moves
    it.skip("6.4.5. Arthur skips future Draw steps, but not a Draw step that's already started.", () => {
      // Example: Arthur - Determined Squire has an ability called No More Books that reads, "Skip your turn's Draw step." If a player would start their Draw step with Arthur in play, they skip their Draw step and move immediately to the Main Phase of their turn. However, if a player finds a way to play Arthur during their Draw step, the current Draw step isn't skipped and proceeds normally.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arthurDeterminedSquire],
          deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
        },
        {
          deck: [arielOnHumanLegs, minnieMouseAlwaysClassy],
        },
      );
    });
  });
});
