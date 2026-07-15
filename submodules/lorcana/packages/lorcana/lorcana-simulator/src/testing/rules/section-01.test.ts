// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/02-gameplay.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  fireTheCannons,
  flounderVoiceOfReason,
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
  smash,
  tangle,
  theQueenWickedAndVain,
} from "@tcg/lorcana-cards/cards/001";
import { lumiereHotheadedCandelabra } from "@tcg/lorcana-cards/cards/002";
import { prideLandsPrideRock } from "@tcg/lorcana-cards/cards/003";
import type { CommandFailure } from "@tcg/lorcana-engine";

describe("### 1. CONCEPTS", () => {
  describe("1.7.5. Characters can’t quest, challenge, or activate any abilities with {E} as a part of their cost unless the character has been in play since the beginning of their player’s turn. This is known as drying. A character becomes dry if they’re in play during the start of their player’s next turn (see 3.2.2.1).", () => {
    it("Dries after passing turn", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseAlwaysClassy],
          inkwell: minnieMouseAlwaysClassy.cost,
          deck: 1,
        },
        {
          deck: 2,
        },
      );

      engine.asPlayerOne().playCard(minnieMouseAlwaysClassy);
      expect(engine.asPlayerOne().getCard(minnieMouseAlwaysClassy).drying).toBe(true);

      engine.asPlayerOne().passTurn();
      expect(engine.asPlayerOne().getCard(minnieMouseAlwaysClassy).drying).toBe(true);

      engine.asPlayerTwo().passTurn();
      expect(engine.asPlayerOne().getCard(minnieMouseAlwaysClassy).drying).toBe(false);
    });

    it("Can't challenge while drying", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseAlwaysClassy],
          inkwell: minnieMouseAlwaysClassy.cost,
          deck: 1,
        },
        {
          hand: [mickeyMouseTrueFriend],
          inkwell: mickeyMouseTrueFriend.cost,
          deck: 1,
        },
      );

      engine.asPlayerOne().playCard(minnieMouseAlwaysClassy);
      engine.asPlayerOne().passTurn();

      engine.asPlayerTwo().playCard(mickeyMouseTrueFriend);
      engine.manualExertCard(minnieMouseAlwaysClassy);

      const result: CommandFailure = engine
        .asPlayerTwo()
        .challenge(mickeyMouseTrueFriend, minnieMouseAlwaysClassy) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("ATTACKER_DRYING");
    });

    it("Can't activate any abilities with {E} as a part of their cost", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theQueenWickedAndVain],
        inkwell: theQueenWickedAndVain.cost,
      });

      engine.asPlayerOne().playCard(theQueenWickedAndVain);
      const result = engine
        .asPlayerOne()
        .activateAbility(theQueenWickedAndVain, "I SUMMON THEE") as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("CARD_DRYING");
    });

    it("can't quest", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseAlwaysClassy],
        inkwell: minnieMouseAlwaysClassy.cost,
      });

      engine.asPlayerOne().playCard(minnieMouseAlwaysClassy);

      const result = engine.asPlayerOne().quest(minnieMouseAlwaysClassy) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("CARD_DRYING");
    });
  });

  describe("#### 1.8. Game State Check", () => {
    // TODO: Add to the BAG test
    // 1.8.2. Triggered abilities that occur as a result of a game state check are added to the bag when their condition is met but won’t resolve until after the game state check or checks are completed.
    // 1.8.3. After a game state check is completed, the game state check immediately occurs again. If no conditions are met during a game state check, players then resolve any triggered abilities in the bag. Once all triggered abilities have been resolved from the bag and there are no further conditions met from a game state check, the game continues.
    it.skip("1.8.1.1. If a player has 20 or more lore, that player wins the game.", () => {});
    it.skip("1.8.1.2. If a player’s turn ends with no cards in their deck, that player loses the game.", () => {});
    it.skip("1.8.1.4. If a character or location has damage equal to or greater than its Willpower {W}, that character or location is banished. A character or location banished as a result of taking damage from a character in a challenge since the last game state check or as a result of taking damage from a character’s ability since the last game state check is considered banished by that character.", () => {});

    // Example A: A player has a Flounder – Voice of Reason in play, a character with 2 {W}. Their opponent plays Fire the Cannons!, an action with an effect that reads, “Deal 2 damage to chosen character,” and chooses Flounder as the action’s effect resolves. Immediately after the action has finished resolving, a game state check occurs. Flounder has 2 damage counters on him and 2 {W}. Flounder has damage equal to or greater than his Willpower, meeting the condition in section 1.8.1.4 and is banished as a result. Another game state check occurs. No other conditions have been met, so the game continues.
    it("Example A: A player has a Flounder – Voice of Reason in play", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flounderVoiceOfReason],
          deck: 1,
        },
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          deck: 1,
        },
      );

      engine.asPlayerOne().passTurn();

      const playResult = engine.asPlayerTwo().playCard(fireTheCannons, {
        targets: [flounderVoiceOfReason],
      });

      expect(playResult).toBeSuccessfulCommand();
      expect(engine.getCard(flounderVoiceOfReason).zone).toBe("discard");
    });

    // Example B: A player has a Pride Lands – Pride Rock and a Flounder – Voice of Reason in play. Pride Lands has an ability We Are All Connected that reads, “Characters get \(+ 2 \bullet\) while here.” Flounder has 2 damage counters on him and is also at the location, giving him a total of 4 {W}. The opponent has a Lumiere – Hotheaded Candelabra in play, a character with 7 {S}. During the opponents turn, Lumiere challenges Pride Lands, dealing 7 damage to the location. Once the challenge is over, a game state check occurs. Pride Lands has damage equal to or greater than its Willpower, meeting the condition in section 1.8.1.5 and is banished as a result. Once the first game state check is completed, another game state check occurs. Without Pride Lands in play, Flounder has damage equal to or greater than his Willpower, meeting the condition in section 1.8.1.4 and is banished as a result. Another game state check occurs. No other conditions have been met, so the game continues.
    it.skip("Example B: A player has a Pride Lands – Pride Rock and a Flounder – Voice of Reason in play.", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            prideLandsPrideRock,
            {
              card: flounderVoiceOfReason,
              damage: 2,
              atLocation: prideLandsPrideRock,
            },
          ],
        },
        {
          play: [lumiereHotheadedCandelabra],
        },
      );

      expect(String(engine.asPlayerOne().getCardLocationId(flounderVoiceOfReason))).toBe(
        String(engine.asPlayerOne().getCard(prideLandsPrideRock).id),
      );
      expect(engine.asPlayerOne().getDamage(flounderVoiceOfReason)).toBe(2);

      engine.asPlayerOne().passTurn();

      const challengeResult = engine
        .asPlayerTwo()
        .challenge(lumiereHotheadedCandelabra, prideLandsPrideRock);

      expect(challengeResult).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getDamage(prideLandsPrideRock)).toBe(7);
      expect(engine.getCard(prideLandsPrideRock).zone).toBe("discard");
      expect(engine.getCard(flounderVoiceOfReason).zone).toBe("discard");
    });
  });

  describe("#### 1.9. Damage", () => {
    it("banishes an opposing character when damage is lethal", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [smash],
          inkwell: smash.cost,
        },
        {
          play: [flounderVoiceOfReason],
        },
      );

      testEngine.asPlayerOne().playCard(smash, {
        targets: [flounderVoiceOfReason],
      });

      expect(testEngine.asPlayerOne().getCardZone(flounderVoiceOfReason)).toEqual("discard");
      expect(testEngine.asPlayerOne().getCard(flounderVoiceOfReason).damage).toBeFalsy();
    });
  });

  describe("#### 1.11. Lore", () => {
    it("If a player would lose lore while they have 0 lore, they don’t lose any.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tangle],
        inkwell: tangle.cost,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toEqual(0);
      testEngine.asPlayerOne().playCard(tangle);
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toEqual(0);
    });
  });
});
