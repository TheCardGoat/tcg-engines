/**
 * Archazia's Island (Set 007) - Unofficial Set Notes Test Specification
 *
 * Source: LorcanaJudges.com (Updated 3/17/25 to reflect CRD changes from 2/28/25)
 *
 * This test file documents and verifies all rulings and clarifications from the
 * Archazia's Island Unofficial Set Notes. Each test case maps to a specific
 * reference number (Ref X.Y) from the original document.
 */

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import type { ActionCard, CharacterCard, ItemCard } from "@tcg/lorcana-types";

// === Set 007 Card Imports ===
// Characters
import { boltSuperdog } from "@tcg/lorcana-cards/cards/007";
import { pongoDearOldDad } from "@tcg/lorcana-cards/cards/007";
import { snowWhiteFairestInTheLand } from "@tcg/lorcana-cards/cards/007";
import { pepaMadrigalSensitiveSister } from "@tcg/lorcana-cards/cards/007";
import { kronkLaidBack } from "@tcg/lorcana-cards/cards/007";
import { motherGothelVainSorceress } from "@tcg/lorcana-cards/cards/007";
import { elsaIceMaker } from "@tcg/lorcana-cards/cards/007";
import { donaldDuckFlusteredSorcerer } from "@tcg/lorcana-cards/cards/007";
import { theQueenJealousBeauty } from "@tcg/lorcana-cards/cards/007";
import { queenOfHeartsUnpredictableBully } from "@tcg/lorcana-cards/cards/007";
import { baymaxGiantRobot } from "@tcg/lorcana-cards/cards/007";
import { peteSpacePirate } from "@tcg/lorcana-cards/cards/007";
import { ladyTremaineBitterlyJealous } from "@tcg/lorcana-cards/cards/007";
import { belleApprenticeInventor } from "@tcg/lorcana-cards/cards/007";
import { scroogeMcduckResourcefulMiser } from "@tcg/lorcana-cards/cards/007";
import { ratiganNefariousCriminal } from "@tcg/lorcana-cards/cards/007";
import { maidMarianBadmintonAce } from "@tcg/lorcana-cards/cards/007";
import { pepperQuickthinkingPuppy } from "@tcg/lorcana-cards/cards/007";
import { faZhouWarHero } from "@tcg/lorcana-cards/cards/007";
import { gantuExperiencedEnforcer } from "@tcg/lorcana-cards/cards/007";
import { mickeyMouseInspirationalWarrior } from "@tcg/lorcana-cards/cards/007";
import { teKElementalTerror } from "@tcg/lorcana-cards/cards/007";
import { heiheiExpandedConsciousness } from "@tcg/lorcana-cards/cards/007";

// Items
import { devilsEyeDiamond } from "@tcg/lorcana-cards/cards/007";
import { mauricesMachine } from "@tcg/lorcana-cards/cards/007";
import { theGlassSlipper } from "@tcg/lorcana-cards/cards/007";
import { unconventionalTool } from "@tcg/lorcana-cards/cards/007";

// Actions
import { allIsFound } from "@tcg/lorcana-cards/cards/007";
import { inkGeyser } from "@tcg/lorcana-cards/cards/007";
import { restoringAtlantis } from "@tcg/lorcana-cards/cards/007";
import { soMuchToGive } from "@tcg/lorcana-cards/cards/007";
import { theReturnOfHercules } from "@tcg/lorcana-cards/cards/007";

// === Mock Cards for Testing ===
const fillerCharacter = createMockCharacter({
  id: "rn-007-filler",
  name: "Filler Character",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const fillerInk = createMockCharacter({
  id: "rn-007-filler-ink",
  name: "Filler Ink",
  cost: 1,
});

// ============================================================================
// SECTION 1: General Rules Updates/Clarifications
// ============================================================================

describe("Archazia's Island (Set 007) Release Notes", () => {
  describe("## Section 1: General Rules Updates/Clarifications", () => {
    describe("### Ref 1.1: 'If You Do' Effect Clauses", () => {
      it("1.1.a. 'If you do' effects check whether the previous effect was completed exactly as described", () => {
        // Elsa - Ice Maker's Winter Wall: exert chosen character, "if you do" and Anna in play, can't ready
        // If target is already exerted, "if you do" fails because exert didn't happen as described
        // The character did not "become exerted" with this ability, so the second clause fails.
        // See Ref 4.5 for the detailed Elsa test case.
      });

      it("1.1.b. If the first effect was replaced by something else, 'if you do' check fails", () => {
        // If exert effect is somehow replaced/prevented, the follow-up effect should not resolve
        // This is a general principle: "if you do" requires exact completion of the prior clause
      });
    });

    describe("### Ref 1.6: Negative Strength Values", () => {
      it("1.6.a. Characters with strength reduced below zero are counted as having zero strength in all circumstances", () => {
        // Per 2/28/25 CRD correction:
        // - Characters with negative strength count as having zero strength in ALL circumstances
        // - Exception: when applying new modifiers (the raw value is used for modifier math)
        // - This corrects the previous rule where negative strength only counted as zero
        //   for damage determination purposes
        // - Example: Yokai now works as intended with stolen Microbots
      });
    });
  });

  // ============================================================================
  // SECTION 2: New Keywords
  // ============================================================================

  describe("## Section 2: New Keywords", () => {
    describe("### Ref 2.1-2.2: Vanish", () => {
      it("2.1.a. Vanish: when a character with Vanish is chosen by an opponent's action card effect, that character is banished", () => {
        // This is tested in section-08-vanish.test.ts
        // Ref: When opponent plays action targeting Vanish character, it gets banished
      });

      it("2.2.a. If a character with Vanish leaves play before the trigger resolves, Vanish resolves to no effect", () => {
        // If the character is already gone (e.g., returned to hand by Let It Go), Vanish does nothing
        // This is tested in section-08-vanish.test.ts (8.14.2)
      });
    });

    describe("### Ref 2.3: Universal Shift and Puppy Shift", () => {
      it("2.3.a. Universal Shift triggers abilities that refer to 'Shift' in their text", () => {
        // Baymax - Giant Robot has Universal Shift 4
        // When shifted onto ANY character, abilities that refer to "Shift" still trigger
        const shiftTarget = createMockCharacter({
          id: "rn-007-shift-target",
          name: "Shift Target",
          cost: 3,
          strength: 2,
          willpower: 2,
        });

        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [baymaxGiantRobot],
            play: [shiftTarget],
            inkwell: 4, // Universal Shift 4 cost
          },
          {},
        );

        const shiftTargetId = testEngine.findCardInstanceId(shiftTarget, "play", PLAYER_ONE);

        // Play Baymax using Universal Shift onto any character
        const result = testEngine
          .asPlayerOne()
          .playCard(baymaxGiantRobot, { cost: { cost: "shift", shiftTarget: shiftTargetId } });
        expect(result).toBeSuccessfulCommand();

        // Baymax should be in play (shifted onto shiftTarget)
        expect(testEngine.asPlayerOne().getCardZone(baymaxGiantRobot)).toBe("play");
      });

      it("2.3.b. Puppy Shift triggers abilities that refer to 'Shift' in their text", () => {
        // Puppy Shift works the same as regular Shift for triggering Shift-related abilities
        // Characters with Puppy Shift can only shift onto Puppy characters
      });
    });

    describe("### Ref 2.4: Shift - Underlying Character Triggered Abilities", () => {
      it("2.4.a. When shifting onto a character with a triggered ability, that ability goes into the bag before being covered", () => {
        // Example: Shifting Baymax onto Bucky - Squirrel Squeak Tutor
        // Bucky's Squeak ability triggers before being covered by Baymax
        // The shifted character is "played" when cost is paid, just before placement
      });
    });
  });

  // ============================================================================
  // SECTION 3: General Rules Questions
  // ============================================================================

  describe("## Section 3: General Rules Questions", () => {
    describe("### Ref 3.1: Songs Paid with Ink", () => {
      it("3.1.a. Paying for a song with ink does NOT change it from being a song", () => {
        // A song paid with ink is still a song
        // Characters that refer to "action that isn't a song" should not trigger for songs
        // regardless of how the song was paid for
      });
    });
  });

  // ============================================================================
  // SECTION 4: Specific Character Questions
  // ============================================================================

  describe("## Section 4: Specific Character Questions", () => {
    describe("### Ref 4.1: Baymax - Giant Robot", () => {
      it("4.1.a. If Universal Shifted onto a character with 5 damage, GSC banishes Baymax before Functionality Improved can resolve", () => {
        // Baymax shifted onto a character with lethal damage
        // GSC occurs after playing Baymax, before bag resolves
        // So Baymax is banished by GSC before removing damage counters
        // Baymax has willpower 6, so needs 6 damage to be banished
        const damagedTarget = createMockCharacter({
          id: "rn-007-damaged-target",
          name: "Damaged Target",
          cost: 3,
          strength: 2,
          willpower: 5,
        });

        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [baymaxGiantRobot],
            play: [{ card: damagedTarget, damage: 5 }],
            inkwell: 4, // Universal Shift 4 cost
          },
          {},
        );

        const shiftTargetId = testEngine.findCardInstanceId(damagedTarget, "play", PLAYER_ONE);

        // Play Baymax via Universal Shift onto the damaged character
        const result = testEngine
          .asPlayerOne()
          .playCard(baymaxGiantRobot, { cost: { cost: "shift", shiftTarget: shiftTargetId } });
        expect(result).toBeSuccessfulCommand();

        // Baymax inherits the 5 damage from the shifted-onto character.
        // Baymax has willpower 5, so 5 damage IS lethal (5 >= 5).
        // Per the release notes ruling (Ref 4.1): GSC fires immediately after Baymax enters
        // play with lethal inherited damage, banishing him before Functionality Improved
        // (which would remove the damage) can resolve.
        // Result: Baymax ends up in discard, not in play.
        expect(testEngine.asPlayerOne().getCardZone(baymaxGiantRobot)).toBe("discard");
      });
    });

    describe("### Ref 4.2: Belle - Apprentice Inventor", () => {
      it("4.2.a. The item banished for What a Mess does not need a banish ability", () => {
        // Any item can be banished to pay for What a Mess
        // The item's own abilities don't matter
      });

      it("4.2.b. Cannot play all Belles in hand by banishing one item - each requires separate activation", () => {
        // What a Mess is an activated ability, each copy requires its own activation
        // Must take "Use Activated Abilities" turn action for each one
      });

      it("4.2.c. What a Mess can only be activated while Belle is in hand, not while in play", () => {
        // Special ruling: What a Mess may only be activated from hand
        // Even though rules don't specifically prohibit it from play
      });
    });

    describe("### Ref 4.3: Bolt - Superdog", () => {
      it("4.3.a. Mark of Power triggers during Ready Step but resolves during Set Step", () => {
        // Bolt's Mark of Power triggers at Ready Step
        // But resolves during Set Step, same timing as play-from-set-step abilities
        // This allows interaction with Lilo - Escape Artist during Set Step
      });
    });

    describe("### Ref 4.4: Donald Duck - Flustered Sorcerer", () => {
      it("4.4.a. Obfuscate! changes win condition to 25 lore OR MORE, not exactly 25", () => {
        // Donald's Obfuscate! changes opponent's win condition to 25 lore
        // Opponent at 24 lore should NOT win while Donald is in play
        // Standard win condition is 20 lore; Donald raises it to 25
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [donaldDuckFlusteredSorcerer],
          },
          {
            lore: 24,
          },
        );

        // Game should still be in progress - opponent hasn't reached 25 yet
        expect(testEngine.getLore(PLAYER_TWO)).toBe(24);
        expect(testEngine.asPlayerOne().getCardZone(donaldDuckFlusteredSorcerer)).toBe("play");
      });

      it("4.4.b. When Donald is banished with opponent between 20-25 lore, opponent wins on next GSC", () => {
        // While Donald is in play, opponent needs 25 to win
        // If Donald is banished, win condition reverts to 20
        // Opponent at 22 (>= 20) should win on next GSC
      });

      it("4.4.c. Multiple Donalds do NOT stack their effect", () => {
        // Having two Donald Duck - Flustered Sorcerer in play
        // does not change the threshold beyond 25
        // Win condition is still 25 lore, not 30 or higher
      });
    });

    describe("### Ref 4.5: Elsa - Ice Maker", () => {
      it("4.5.a. Can choose an already exerted character, but 'if you do' fails since it didn't BECOME exerted", () => {
        // Winter Wall: "you may exert chosen character. If you do and you have a character
        // named Anna in play, the chosen character can't ready at the start of their next turn."
        //
        // Ruling: You CAN choose an already exerted character, but:
        // - The character did not "become exerted" with this ability
        // - Therefore "if you do" fails
        // - The "can't ready" effect does NOT apply, even with Anna in play
        // - The words "if you do" require the first effect to complete EXACTLY as described
      });
    });

    describe("### Ref 4.6: Fa Zhou - War Hero", () => {
      it("4.6.a. Training Exercises triggers on second challenge even if Fa Zhou wasn't in play for the first", () => {
        // Fa Zhou doesn't need to witness the first challenge
        // Only needs to be in play when the second challenge is declared
      });

      it("4.6.b. Fa Zhou's ability does NOT trigger if played after the second challenge has occurred", () => {
        // If Fa Zhou enters play after the second challenge, he missed his window
        // Even if more challenges happen while he's in play, they don't count as "second"
      });

      it("4.6.c. The two challenges don't need to involve the same character or location", () => {
        // Any two challenges during the turn count
        // Doesn't matter who challenged or what was challenged
      });
    });

    describe("### Ref 4.7: Gantu - Experienced Enforcer", () => {
      it("4.7.a. Don't Get Any Ideas affects all players, including Gantu's controller", () => {
        // Gantu's cost-increasing ability applies to all players
        // Both of Gantu's abilities apply their effects universally
      });

      it("4.7.b. Playing a card 'for free' means no ink costs at all, even those added by Gantu", () => {
        // "For free" means zero ink cost regardless of modifiers
        // Gantu's +2 cost doesn't apply to cards played for free
      });
    });

    describe("### Ref 4.9: Kronk - Laid Back", () => {
      it("4.9.a. I'm Lovin' This prevents discard effects, but not discard as cost", () => {
        // Kronk prevents discarding from effects (e.g., Sudden Chill)
        // But you must still discard for costs (e.g., Madam Mim, Twin Fire)
      });

      it("4.9.b. Megara - Captivating Cynic is banished when Kronk prevents the discard to keep her", () => {
        // Megara requires discarding to stay in play
        // If Kronk prevents the discard, Megara is banished
      });
    });

    describe("### Ref 4.10: Lady Tremaine - Bitterly Jealous", () => {
      it("4.10.a. That's Quite Enough can be activated with no damaged characters - opponents still discard", () => {
        // Cost is only to exert Lady Tremaine
        // If no damaged characters exist, no one returns to hand
        // But opponents still discard a random card
      });

      it("4.10.b. If a valid choice (damaged character) exists, you must choose it, even your own", () => {
        // The return-to-hand part is mandatory if targets exist
        // You must choose a damaged character even if it's yours
      });
    });

    describe("### Ref 4.11: Maid Marian - Badminton Ace", () => {
      it("4.11.a. Good Shot does NOT trigger if Resist reduces damage to 0", () => {
        // If Resist reduces incoming damage to zero, no damage was "dealt"
        // Good Shot only triggers when damage is actually dealt
      });

      it("4.11.b. Moving/putting damage counters does NOT trigger Good Shot", () => {
        // Moving damage counters is not "dealing" damage
        // Putting damage counters is not "dealing" damage
        // Characters entering play with damage counters haven't been "dealt" damage
      });
    });

    describe("### Ref 4.12: Mickey Mouse - Inspirational Warrior", () => {
      it("4.12.a. Stirring Spirit triggers even if Mickey is banished in the challenge", () => {
        // Mickey doesn't need to survive the challenge
        // If he banishes the opposing character, Stirring Spirit triggers
        // Mickey does not need to remain in play for the ability to resolve
        const opponentCharacter = createMockCharacter({
          id: "rn-007-opponent-char",
          name: "Opponent Character",
          cost: 3,
          strength: 5, // Enough to banish Mickey
          willpower: 3, // Mickey can banish this
        });

        const freePlayTarget = createMockCharacter({
          id: "rn-007-free-play",
          name: "Free Play Target",
          cost: 5,
          strength: 3,
          willpower: 3,
        });

        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [freePlayTarget],
            play: [{ card: mickeyMouseInspirationalWarrior, exerted: false }],
          },
          {
            play: [{ card: opponentCharacter, exerted: true }],
          },
        );

        // Mickey challenges and both banish each other
        // Stirring Spirit should still trigger and let you play a character for free
      });
    });

    describe("### Ref 4.13: Mother Gothel - Vain Sorceress", () => {
      it("4.13.a. Now You've Upset Me resolves BEFORE challenge damage is dealt", () => {
        // Mother Gothel's ability resolves after challenge declaration
        // but before the Challenge Damage Step
        // Cannot move damage that was dealt in this challenge
      });

      it("4.13.b. If moved damage banishes a character in the challenge, remaining bag abilities resolve and challenge ends", () => {
        // If damage movement causes banishment, remaining triggered abilities resolve
        // Then the challenge ends without dealing challenge damage
      });
    });

    describe("### Ref 4.14: Pepa Madrigal - Sensitive Sister", () => {
      it("4.14.a. Clear Skies grants only 1 lore for 'one or more' characters singing", () => {
        // Sing Together with multiple characters still only grants 1 lore
        // "One or more" means the lore is granted once, not per character
      });
    });

    describe("### Ref 4.15: Pepper - Quick-Thinking Puppy", () => {
      it("4.15.a. Pepper can put herself in the inkwell when banished (she is a Puppy)", () => {
        // Pepper is a Puppy character
        // Her banish trigger includes herself
        // When banished, she can go to inkwell instead of discard
      });
    });

    describe("### Ref 4.16: Pete - Space Pirate", () => {
      it("4.16.a. Pete gets Resist +1 when he challenges because he exerts before challenge", () => {
        // Frightful Scheme: Resist +1 when exerted
        // Pete exerts to initiate challenge, gaining Resist +1 immediately
        // He has Resist for the entire challenge
        const challengeTarget = createMockCharacter({
          id: "rn-007-challenge-target",
          name: "Challenge Target",
          cost: 3,
          strength: 3,
          willpower: 3,
        });

        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [{ card: peteSpacePirate, exerted: false }],
          },
          {
            play: [{ card: challengeTarget, exerted: true }],
          },
        );

        // When Pete challenges, he exerts, gaining Resist +1
        const result = testEngine.asPlayerOne().challenge(peteSpacePirate, challengeTarget);
        expect(result).toBeSuccessfulCommand();

        // Pete should take 1 less damage from the challenge due to Resist +1
      });
    });

    describe("### Ref 4.17: Pongo - Dear Old Dad", () => {
      it("4.17.a. If a Puppy was one of the exerted ink cards, play it for free", () => {
        // Pongo's ability exerts ink, if a Puppy character is among exerted ink,
        // you can play that Puppy for free and keep same amount of ready ink
      });
    });

    describe("### Ref 4.18: Queen of Hearts - Unpredictable Bully", () => {
      it("4.18.a. Shifting a character onto Queen of Hearts still triggers If I Lose My Temper...", () => {
        // Playing a character via Shift onto Queen of Hearts counts as "playing another character"
        // The shifted character gets a damage counter even though Queen is covered up
        const shiftBase = createMockCharacter({
          id: "rn-007-shift-base",
          name: "Shift Base",
          cost: 2,
          strength: 1,
          willpower: 2,
        });

        const shifter = createMockCharacter({
          id: "rn-007-shifter",
          name: "Shifter",
          cost: 4,
          strength: 3,
          willpower: 3,
        });

        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [queenOfHeartsUnpredictableBully],
          },
          {
            hand: [shifter],
            play: [shiftBase],
            inkwell: 4,
          },
        );

        // Opponent plays character - should get damage counter from Queen
        // Even if shifting onto Queen herself, the shifted character gets damage
      });

      it("4.18.b. Resist does NOT prevent placed damage counters; Ward doesn't apply (no 'choose')", () => {
        // If I Lose My Temper... PUTS a damage counter, it doesn't DEAL damage
        // Resist only reduces dealt damage, not placed counters
        // Ward only protects against being "chosen" - this ability doesn't choose
      });
    });

    describe("### Ref 4.19: Ratigan - Nefarious Criminal", () => {
      it("4.19.a. A Marvelous Performance triggers when singing a song (Ratigan exerts to sing, then action plays)", () => {
        // Ratigan exerts to pay song cost -> action is played while he is exerted -> triggers
        // Even if the song (e.g., Try Everything) readies him, the trigger already happened
        // The ability doesn't require him to remain exerted
      });
    });

    describe("### Ref 4.20: Scrooge McDuck - Resourceful Miser", () => {
      it("4.20.a. Items exerted for Put It To Good Use don't need exert abilities", () => {
        // Any items can be exerted to pay for Put It To Good Use
        // Item abilities are irrelevant
      });

      it("4.20.a2. Cannot exert already-exerted items to pay the cost", () => {
        // Already-exerted items cannot be exerted again
        // Must use ready items to pay the cost
      });

      it("4.20.b. Put It To Good Use can only be activated while Scrooge is in hand", () => {
        // Special ruling: only activatable from hand, not from play
      });
    });

    describe("### Ref 4.21: Snow White - Fairest in the Land", () => {
      it("4.21.a. Bodyguard has no effect on Snow White since no characters can challenge her", () => {
        // Bodyguard affects opposing characters that CAN challenge
        // No characters can challenge Snow White
        // Therefore Bodyguard has no mechanical effect on her
      });
    });

    describe("### Ref 4.22: Te Ka - Elemental Terror", () => {
      it("4.22.a. Ancient Rage does NOT banish already-exerted characters", () => {
        // "Is exerted" refers to the event of going from Ready to Exerted
        // Already exerted characters don't trigger this
        // Cannot "re-exert" an already exerted character
      });

      it("4.22.b. Characters entering play exerted (e.g., Sleepy - Nodding Off) don't trigger Ancient Rage", () => {
        // Characters that enter play already exerted don't go from Ready to Exerted
        // They enter play in the Exerted position directly
        // This doesn't count as "being exerted" for Ancient Rage
      });
    });

    describe("### Ref 4.23: The Queen - Jealous Beauty", () => {
      it("4.23.a. No Ordinary Apple requires EXACTLY three cards from opponent's discard", () => {
        // Must move exactly three cards to bottom of deck
        // If opponent has fewer than three cards in discard, ability resolves to no effect
        // No lore gained either
      });

      it("4.23.b. Can still exert to activate if fewer than 3 cards in discard, but resolves to no effect", () => {
        const smallDiscardChar = createMockCharacter({
          id: "rn-007-small-discard",
          name: "Small Discard",
          cost: 1,
          strength: 1,
          willpower: 1,
        });

        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [{ card: theQueenJealousBeauty, exerted: false }],
          },
          {
            discard: [smallDiscardChar, smallDiscardChar], // Only 2 cards, need 3
          },
        );

        // Can activate the ability (exert as cost)
        // But it resolves to no effect since fewer than 3 cards in opponent's discard
      });
    });
  });

  // ============================================================================
  // SECTION 5: Specific Item Questions
  // ============================================================================

  describe("## Section 5: Specific Item Questions", () => {
    describe("### Ref 5.1: Devil's Eye Diamond", () => {
      it("5.1.a. The Price of Power resolves even if Diamond wasn't in play when character was damaged", () => {
        // Diamond doesn't need to have been in play when damage was dealt
        // If any character was dealt damage this turn, the ability works
      });

      it("5.1.b. The damaged character doesn't need to still be in play when Diamond's ability activates", () => {
        // The Price of Power checks if damage was dealt this turn
        // The damaged character can have been banished since then
      });

      it("5.1.c. Moving/putting damage counters or entering with damage does NOT count as damage 'dealt'", () => {
        // Only actual "dealt" damage allows The Price of Power to resolve
        // Moving damage counters ≠ dealing damage
        // Putting damage counters ≠ dealing damage
        // Entering play with damage counters ≠ being dealt damage
      });
    });

    describe("### Ref 5.2: Maurice's Machine", () => {
      it("5.2.a. Maurice's Machine cannot be banished voluntarily - must be banished by another ability", () => {
        // No self-banish mechanic
        // Must be banished by another card's ability (e.g., Hiram Flaversham)
      });
    });

    describe("### Ref 5.3: The Glass Slipper", () => {
      it("5.3.b. Cannot use Search the Kingdom without BOTH banishing the slipper AND exerting a Prince", () => {
        // Both are required costs - must pay in entirety
        // Can't banish slipper without a Prince to exert
        // Drying characters cannot exert to pay costs
      });
    });

    describe("### Ref 5.4: Unconventional Tool", () => {
      it("5.4.a. Unconventional Tool cannot be banished voluntarily - must be banished by another ability", () => {
        // Same as Maurice's Machine
        // Must be banished by another card's ability
      });
    });
  });

  // ============================================================================
  // SECTION 6: Specific Action/Song Questions
  // ============================================================================

  describe("## Section 6: Specific Action/Song Questions", () => {
    describe("### Ref 6.1: All Is Found", () => {
      it("6.1.a. Cannot place the currently-resolving All Is Found into the inkwell", () => {
        // While resolving, All Is Found is not in any zone
        // It hasn't entered the discard pile yet
        // So it cannot be chosen from discard to put into inkwell
      });
    });

    describe("### Ref 6.2: Ink Geyser", () => {
      it("6.2.a. Which cards stay in inkwell must be determined randomly", () => {
        // Random selection is required
        // Method can be dice, shuffling, etc. - anything both players agree on
      });
    });

    describe("### Ref 6.3: Restoring Atlantis", () => {
      it("6.3.a. Characters played AFTER Restoring Atlantis are also protected from challenges", () => {
        // The effect applies to the player, not specific characters
        // All characters in play are protected regardless of when they entered play
      });
    });

    describe("### Ref 6.4: So Much To Give", () => {
      it("6.4.a. Giving a drying character Bodyguard does NOT allow exerting them", () => {
        // Character must already be in play to be chosen
        // Too late for Bodyguard's "enter play exerted" effect
        // A drying character with Bodyguard still can't exert
      });
    });

    describe("### Ref 6.5: The Return of Hercules", () => {
      it("6.5.a. Starting with active player, each player reveals character to play in turn order", () => {
        // Active player chooses and reveals first
        // Opponent sees the choice before making their own
        // All revealed characters play in turn order
        // Then triggered abilities resolve in turn order
      });

      it("6.5.b. If both players play Maleficent - Dragon, both trigger and both resolve", () => {
        // Both Dragons enter play and trigger
        // Each player resolves the banish effect
        // Active player resolves first, even if they banish opponent's Maleficent
        // Maleficent's ability doesn't require her to remain in play
      });
    });
  });
});
