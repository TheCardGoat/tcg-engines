import { describe, expect, it } from "bun:test";
import {
  arielOnHumanLegs,
  belleStrangeButSpecial,
  fishboneQuill,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import {
  grammaTalaSpiritOfTheOcean,
  miloThatchCleverCartographer,
  plutoFriendlyPooch,
} from "@tcg/lorcana-cards/cards/003";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import type { CommandFailure } from "@tcg/lorcana-engine";
import type { ZoneId } from "@tcg/lorcana-types";
import { sailTheAzuriteSea } from "@tcg/lorcana-cards/cards/006";

const inkableCard = arielOnHumanLegs;
const secondInkableCard = stitchNewDog;
const thirdInkableCard = miloThatchCleverCartographer;
const nonInkableCard = plutoFriendlyPooch;
const inkTriggerWatcher = grammaTalaSpiritOfTheOcean;

describe("#### 4. TURN ACTIONS", () => {
  describe("#### 4.2. Ink a Card", () => {
    it("4.2.1. The player declares they’re putting a card into their inkwell. To do so, the player follows the process listed in sections 4.2.1.1 through 4.2.1.3:", () => {
      // 4.2.1.1. First, the player chooses and reveals a card from their hand with the inkwell symbol.
      // 4.2.1.2. Second, all players verify that the inkwell symbol is present on the revealed card.
      // 4.2.1.3. Third, the player puts the revealed card into their inkwell facedown and ready. This marks the end of the process.

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(inkableCard)).toBe(false);
      expect(testEngine.isCardFaceDown(inkableCard, "inkwell", PLAYER_ONE)).toBe(true);
    });

    it("4.2.2. Once the process of inking a card is complete, the player can resolve any triggered abilities that were added to the bag. When all abilities have been resolved, the turn action is complete.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard],
        play: [inkTriggerWatcher],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("4.2.3. This turn action is limited to once during the active player’s turn.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard, secondInkableCard],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      const secondInkAttempt = testEngine.asPlayerOne().ink(secondInkableCard) as CommandFailure;
      expect(secondInkAttempt.success).toBe(false);
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(1);
    });

    describe("4.2.3.1. Some effects allow a player to put “additional” cards into their inkwell. These effects continually adjust the once-per-turn limit of the turn action for as long as the effect allowing the additional cards into the inkwell applies.", () => {
      it("Double Belle - Strange But Special", () => {
        // Example: Belle – Strange But Special has an ability Read a Book that reads, “During your turn, you may put an additional card from your hand into your inkwell facedown.” A player can put two cards into their inkwell during their turn: one from the turn action and one from Belle’s ability. If an effect returns Belle to a player’s hand and the card is replayed, the player can’t put another card into their inkwell because the additional card was already added to their inkwell for the turn. If the player has two copies of Belle in play, then they could put a third card into their inkwell.
        const singleBelleEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [inkableCard, secondInkableCard, thirdInkableCard, belleStrangeButSpecial],
          inkwell: belleStrangeButSpecial.cost,
          play: [belleStrangeButSpecial],
          deck: 1,
        });

        expect(singleBelleEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
        expect(singleBelleEngine.asPlayerOne().ink(secondInkableCard)).toBeSuccessfulCommand();
        // At the moment, the second belle is at hand. So inking should fail
        expect(singleBelleEngine.asPlayerOne().ink(thirdInkableCard)).toEqual(
          expect.objectContaining({
            errorCode: "ALREADY_INKED",
          }),
        );

        const belleInHandId = singleBelleEngine.findCardInstanceId(
          belleStrangeButSpecial,
          "hand",
          PLAYER_ONE,
        );

        expect(singleBelleEngine.asPlayerOne().playCard(belleInHandId)).toEqual(
          expect.objectContaining({ success: true }),
        );

        expect(singleBelleEngine.asPlayerOne().ink(thirdInkableCard)).toBeSuccessfulCommand();

        const doubleBelleEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [inkableCard, secondInkableCard, thirdInkableCard],
          play: [belleStrangeButSpecial, belleStrangeButSpecial],
          deck: 1,
        });

        expect(doubleBelleEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
        expect(doubleBelleEngine.asPlayerOne().ink(secondInkableCard)).toBeSuccessfulCommand();
        expect(doubleBelleEngine.asPlayerOne().ink(thirdInkableCard)).toBeSuccessfulCommand();
      });

      it("Sail the Azurite Sea", () => {
        const singleBelleEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [inkableCard, secondInkableCard, sailTheAzuriteSea],
          inkwell: sailTheAzuriteSea.cost,
          deck: 1,
        });

        expect(singleBelleEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
        // At the moment, sailTheAzuriteSea is in hand. So inking should fail
        expect(singleBelleEngine.asPlayerOne().ink(secondInkableCard)).toEqual(
          expect.objectContaining({
            errorCode: "ALREADY_INKED",
          }),
        );

        expect(singleBelleEngine.asPlayerOne().playCard(sailTheAzuriteSea)).toEqual(
          expect.objectContaining({ success: true }),
        );
        expect(singleBelleEngine.asPlayerOne().ink(secondInkableCard)).toBeSuccessfulCommand();
      });
    });

    it("4.2.3.2. Some effects allow a player to put a card directly into their inkwell. These effects aren’t counted toward the once-per-turn limit of the turn action, and the card isn’t revealed as it’s put into the player’s inkwell.", () => {
      //  Example: Fishbone Quill is an item that has the ability Go Ahead and Sign, which reads, “{E} — Put any card from your hand into your inkwell facedown.” A player may use this ability as many times as they can pay its cost. Cards added to the inkwell this way aren’t revealed.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard, nonInkableCard],
        play: [{ card: fishboneQuill, exerted: false }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonInkableCard)).toBe("hand");

      const fishboneQuillId = testEngine.findCardInstanceId(fishboneQuill, "play", PLAYER_ONE);
      const nonInkableCardId = testEngine.findCardInstanceId(nonInkableCard, "hand", PLAYER_ONE);
      const result = testEngine.executeMoveForView("playerOne", "activateAbility", {
        args: {
          cardId: fishboneQuillId,
          abilityIndex: 0,
          targets: [nonInkableCardId],
        },
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonInkableCard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(2);
      expect(testEngine.isCardFaceDown(nonInkableCard, "inkwell", PLAYER_ONE)).toBe(true);
    });

    it("UI HELPER: When putting a card in inkwell, we create a log entry that shows the card put into inkwell. And reveal it to opponent.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      // TODO: Check that both player one and player two see a log entry that shows the card added to inkwell
      expect(testEngine.isCardVisible(inkableCard, PLAYER_ONE)).toBe(true);
      expect(testEngine.isCardVisible(inkableCard, PLAYER_TWO)).toBe(true);

      testEngine.asPlayerOne().passTurn();
      expect(testEngine.isCardVisible(inkableCard, PLAYER_ONE)).toBe(true);
      expect(testEngine.isCardVisible(inkableCard, PLAYER_TWO)).toBe(true);

      testEngine.asPlayerTwo().passTurn();
      expect(testEngine.isCardVisible(inkableCard, PLAYER_ONE)).toBe(false);
      expect(testEngine.isCardVisible(inkableCard, PLAYER_TWO)).toBe(false);

      const moveLogHistory = testEngine.getServerEngine().getRuntime().getMoveLogHistory();

      const inkLogEntry = [...moveLogHistory].reverse().find((log) => log.moveType === "inkCard");

      expect(inkLogEntry).toMatchObject({
        moveType: "inkCard",
        playerId: PLAYER_ONE,
        public: [
          {
            key: "lorcana.card.inked",
            values: {
              cardId: expect.any(String),
              playerId: PLAYER_ONE,
            },
          },
        ],
      });
    });
  });
});
