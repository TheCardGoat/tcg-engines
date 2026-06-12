// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/04-turn-actions.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  arielOnHumanLegs,
  belleStrangeButSpecial,
  dinglehopper,
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
  plasmaBlaster,
  simbaProtectiveCub,
  stitchNewDog,
  theQueenWickedAndVain,
} from "@tcg/lorcana-cards/cards/001";
import {
  jafarStrikingIllusionist,
  miloThatchCleverCartographer,
} from "@tcg/lorcana-cards/cards/003";
import { ingeniousDevice } from "@tcg/lorcana-cards/cards/010";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";

const inkOne = arielOnHumanLegs;
const inkTwo = stitchNewDog;
const playerOneFillerOne = belleStrangeButSpecial;
const playerOneFillerTwo = miloThatchCleverCartographer;
const playerTwoFillerOne = jafarStrikingIllusionist;
const playerTwoFillerTwo = plasmaBlaster;
const playedThisTurnItem = dinglehopper;
const paidAbilityItem = plasmaBlaster;

describe("#### 4. TURN ACTIONS", () => {
  // 4.4.1. An activated ability is an ability listed on a card the active player has in play that they can use to pay a cost to generate an effect. Activated abilities are normally written as [Cost] — [Effect].
  describe("#### 4.4. Use an Activated Ability", () => {
    it("4.4.2. An activated ability with an {E} cost on a character can be used only if the character is dry.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theQueenWickedAndVain],
        inkwell: theQueenWickedAndVain.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(theQueenWickedAndVain)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain)).toEqual(
        expect.objectContaining({
          errorCode: "CARD_DRYING",
        }),
      );
    });

    it("4.4.2. An activated ability on an item can be used during the turn the item is played.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [playedThisTurnItem],
        play: [{ card: arielOnHumanLegs, damage: 1 }],
        inkwell: [inkOne, inkTwo],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(playedThisTurnItem)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(playedThisTurnItem)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(playedThisTurnItem, {
          ability: "STRAIGHTEN HAIR",
          targets: [arielOnHumanLegs],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().isExerted(playedThisTurnItem)).toBe(true);
    });

    it("If you can't pay the cost can't activate the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [dinglehopper, theQueenWickedAndVain, arielOnHumanLegs],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(dinglehopper, {
          ability: "STRAIGHTEN HAIR",
          targets: [arielOnHumanLegs],
        }).success,
      ).toBe(true);
      expect(
        testEngine.asPlayerOne().activateAbility(dinglehopper, {
          ability: "STRAIGHTEN HAIR",
          targets: [arielOnHumanLegs],
        }),
      ).toEqual(
        expect.objectContaining({
          success: false,
          errorCode: "CARD_EXERTED",
        }),
      );

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain, {
          ability: "I SUMMON THEE",
        }).success,
      ).toBe(true);
      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain, {
          ability: "I SUMMON THEE",
        }),
      ).toEqual(
        expect.objectContaining({
          success: false,
          errorCode: "CARD_EXERTED",
        }),
      );
    });

    it("4.4.3. Only the active player can use activated abilities.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenWickedAndVain],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const result = testEngine
        .asPlayerOne()
        .activateAbility(theQueenWickedAndVain, "I SUMMON THEE") as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("NOT_PRIORITY_HOLDER");
    });

    it("4.4.3.4. The player pays the total cost in full before the effect resolves.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plasmaBlaster, arielOnHumanLegs],
        inkwell: [inkOne, inkTwo],
        deck: 1,
      });

      const firstInkId = testEngine.findCardInstanceId(inkOne, "inkwell", PLAYER_ONE);
      const secondInkId = testEngine.findCardInstanceId(inkTwo, "inkwell", PLAYER_ONE);
      expect(testEngine.asServer().getCard(firstInkId)?.exerted).toBe(false);
      expect(testEngine.asServer().getCard(secondInkId)?.exerted).toBe(false);

      const result = testEngine.asPlayerOne().activateAbility(plasmaBlaster);

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(plasmaBlaster)).toBe(true);
      expect(testEngine.asServer().getCard(firstInkId)?.exerted).toBe(true);
      expect(testEngine.asServer().getCard(secondInkId)?.exerted).toBe(true);
      expect(testEngine.asPlayerOne().getCard(arielOnHumanLegs).damage).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      expect(testEngine.asPlayerOne().respondWith(arielOnHumanLegs)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(arielOnHumanLegs).damage).toBe(1);
    });

    it("4.4.4. Once the total cost is paid, the ability is activated. The active player resolves the effect immediately. This marks the end of the process. ", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theQueenWickedAndVain, isDrying: false }],
          deck: [playerOneFillerOne, playerOneFillerTwo],
        },
        {
          deck: [playerTwoFillerOne, playerTwoFillerTwo],
        },
      );

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

      const result = testEngine
        .asPlayerOne()
        .activateAbility(theQueenWickedAndVain, "I SUMMON THEE");

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(theQueenWickedAndVain)).toBe(true);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
