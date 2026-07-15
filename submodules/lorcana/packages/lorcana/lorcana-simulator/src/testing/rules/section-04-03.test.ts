import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  arielSpectacularSinger,
  coconutBasket,
  dinglehopper,
  eyeOfTheFates,
  fireTheCannons,
  flounderVoiceOfReason,
  friendsOnTheOtherSide,
  gastonArrogantHunter,
  justInTime,
  lefouBumbler,
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
} from "@tcg/lorcana-cards/cards/001";
import { akoodEtEmuti } from "@tcg/lorcana-cards/cards/011";
import {
  hiddenCoveTranquilHaven,
  mickeyMouseBraveLittlePrince,
  theQueenWickedAndVain,
} from "@tcg/lorcana-cards/cards/009";
import { docLeaderOfTheSevenDwarfs } from "@tcg/lorcana-cards/cards/002";
import { perditaPlayfulMother } from "@tcg/lorcana-cards/cards/007";
import { gadgetHackwrenchBrilliantBosun } from "@tcg/lorcana-cards/cards/006";
import { dalmatianPuppyTailWagger } from "@tcg/lorcana-cards/cards/008";

describe("#### 4. TURN ACTIONS", () => {
  describe("#### 4.3. Play a Card", () => {
    it("4.3.1. The active player can play a card from their hand by announcing the card and paying its cost.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseAlwaysClassy],
          inkwell: minnieMouseAlwaysClassy.cost,
        },
        {
          hand: [mickeyMouseTrueFriend],
          inkwell: mickeyMouseTrueFriend.cost,
        },
      );

      testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy);

      expect(testEngine.asPlayerOne().getCardZone(minnieMouseAlwaysClassy)).toBe("play");
      expect(testEngine.asPlayerOne().getCard(minnieMouseAlwaysClassy).drying).toBe(true);

      expect(testEngine.asPlayerTwo().playCard(mickeyMouseTrueFriend)).toEqual(
        expect.objectContaining({
          errorCode: "NOT_PRIORITY_HOLDER",
        }),
      );
    });

    it("4.3.2. The process for playing a card listed in sections 4.3.2.1 through 4.3.2.4 applies to all cards that can be played. Cards can normally be played only from a player’s hand. Only the active player can play a card during their turn.", () => {
      // 4.3.2.1. First, the active player announces the card they intend to play and reveals it from their hand.
      // 4.3.2.2. Second, the player announces how they intend to play the card, whether for its ink cost or an alternate cost. If multiple alternate costs could apply, the player chooses one and ignores the others. If the card is played for the alternate cost of “for free,” that alternate cost is immediately chosen, and the player ignores all costs to play the card and skips directly to 4.3.3 (see 1.5.5).
      // 4.3.2.3. Third, the player determines the total cost needed to play the card. The total cost is the ink cost or alternate cost plus any payment modifiers. The resulting cost is the total cost.
      // 4.3.2.4. Fourth, the player pays the total cost. If the total cost includes any ink, the player must exert a number of ready ink cards equal to the ink cost. If any other costs are included, the player pays those costs as instructed by the card text. Costs can be paid in any order but must be paid in full.
    });

    it("4.3.3.1. If the card is a character, item, or location, the card enters the Play zone. If it’s a character card being played using its Shift ability, it must be put on top of the card referenced in the alternate cost to play it. This marks the end of the process.", () => {
      const initialInkwell =
        minnieMouseAlwaysClassy.cost + dinglehopper.cost + hiddenCoveTranquilHaven.cost;

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseAlwaysClassy, dinglehopper, hiddenCoveTranquilHaven],
        inkwell: initialInkwell,
      });

      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(initialInkwell);

      testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy);
      expect(testEngine.asPlayerOne().getCardZone(minnieMouseAlwaysClassy)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(
        initialInkwell - minnieMouseAlwaysClassy.cost,
      );

      testEngine.asPlayerOne().playCard(dinglehopper);
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(
        initialInkwell - minnieMouseAlwaysClassy.cost - dinglehopper.cost,
      );

      testEngine.asPlayerOne().playCard(hiddenCoveTranquilHaven);
      expect(testEngine.asPlayerOne().getCardZone(hiddenCoveTranquilHaven)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(
        initialInkwell -
          minnieMouseAlwaysClassy.cost -
          dinglehopper.cost -
          hiddenCoveTranquilHaven.cost,
      );
    });

    it("4.3.3.2. If the card is an action, the card enters the Play zone and its effect resolves immediately. Then, the card moves to the player’s discard pile. This marks the end of the process.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [flounderVoiceOfReason],
        },
      );

      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [flounderVoiceOfReason],
      });

      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(flounderVoiceOfReason)).toBe("discard");
    });

    describe("4.3.2.2. Second, the player announces how they intend to play the card, whether for its ink cost or an alternate cost. If multiple alternate costs could apply, the player chooses one and ignores the others. If the card is played for the alternate cost of “for free,” that alternate cost is immediately chosen, and the player ignores all costs to play the card and skips directly to 4.3.3 (see 1.5.5).", () => {
      it("Shift", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [mickeyMouseBraveLittlePrince],
          inkwell: 5,
          play: [mickeyMouseTrueFriend],
        });

        const shiftTarget = testEngine.findCardInstanceId(
          mickeyMouseTrueFriend,
          "play",
          PLAYER_ONE,
        );

        expect(
          testEngine.asPlayerOne().playCard(mickeyMouseBraveLittlePrince, {
            cost: {
              cost: "shift",
              shiftTarget,
            },
          }).success,
        ).toBe(true);

        expect(testEngine.asPlayerOne().getCardZone(mickeyMouseBraveLittlePrince)).toBe("play");
        expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
        expect(testEngine.getCardsUnder(mickeyMouseBraveLittlePrince)).toEqual([shiftTarget]);
      });

      it("Sing", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [friendsOnTheOtherSide],
          play: [{ card: arielSpectacularSinger, isDrying: false }],
          deck: [minnieMouseAlwaysClassy, dinglehopper],
        });

        const singer = testEngine.findCardInstanceId(arielSpectacularSinger, "play", PLAYER_ONE);

        expect(
          testEngine.asPlayerOne().playCard(friendsOnTheOtherSide, {
            cost: {
              cost: "sing",
              singer,
            },
          }).success,
        ).toBe(true);

        expect(testEngine.asPlayerOne().isExerted(arielSpectacularSinger)).toBe(true);
        expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toBe("discard");
        expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(0);
        expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      });
    });

    describe("4.3.6. Payment modifiers that apply to “the next [Card Type] you play” always apply to the next card of that type you play within the specified duration, even if you pay an alternate cost to play that card. If the payment modifier applies to a card with a specific classification, it applies to the next card with that classification, even if other cards of the same type are played before it. Some cards have a self-referential payment modifier that functions while the card is in a non-Play zone, meaning it applies to the card it’s listed on only when that card is played. A modifier that isn’t self-referential functions only while the card it’s listed on is in play.", () => {
      it("4.3.6. Example A.", () => {
        // Example A: Doc – Leader of the Seven Dwarfs has an ability called Share and Share Alike that reads, “Whenever this character quests, you pay 1 {I} less for the next character you play this turn.” If the active player exerted Doc to quest this turn and then played a character for free as a result of another effect (such as from playing Just in Time), the 1 {I} payment reduction still applies.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [justInTime, theQueenWickedAndVain, mickeyMouseTrueFriend],
          play: [docLeaderOfTheSevenDwarfs],
          inkwell: justInTime.cost + mickeyMouseTrueFriend.cost,
        });

        expect(testEngine.asPlayerOne().getCard(mickeyMouseTrueFriend).playCost).toBe(
          mickeyMouseTrueFriend.cost,
        );

        testEngine.asPlayerOne().quest(docLeaderOfTheSevenDwarfs);
        expect(testEngine.asPlayerOne().getCard(mickeyMouseTrueFriend).playCost).toBe(
          mickeyMouseTrueFriend.cost - 1,
        );

        testEngine.asPlayerOne().playCard(justInTime, {
          resolveOptional: true,
          targets: [theQueenWickedAndVain],
        });
        expect(testEngine.asPlayerOne().getCard(theQueenWickedAndVain).zone).toBe("play");

        expect(testEngine.asPlayerOne().getCard(mickeyMouseTrueFriend).playCost).toBe(
          mickeyMouseTrueFriend.cost - 1,
        );

        testEngine.asPlayerOne().playCard(mickeyMouseTrueFriend);
        expect(testEngine.asPlayerOne().getCard(mickeyMouseTrueFriend).zone).toBe("play");
        expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
      });

      it("4.3.6. Example B.", () => {
        // Example B: Perdita – Playful Mother has an ability called Who’s Next? that reads, “Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.” If the active player quests with Perdita and then plays a Flounder – Voice of Reason, the payment modifier for a Puppy character would still apply to the next Puppy character they play, since Flounder doesn’t have the Puppy classification.
        const initialInkwell = flounderVoiceOfReason.cost + dalmatianPuppyTailWagger.cost;
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          inkwell: initialInkwell,
          hand: [flounderVoiceOfReason, dalmatianPuppyTailWagger],
          play: [perditaPlayfulMother],
        });

        expect(testEngine.asPlayerOne().getCard(flounderVoiceOfReason).playCost).toBe(
          flounderVoiceOfReason.cost,
        );
        expect(testEngine.asPlayerOne().getCard(dalmatianPuppyTailWagger).playCost).toBe(
          dalmatianPuppyTailWagger.cost,
        );

        testEngine.asPlayerOne().quest(perditaPlayfulMother);
        expect(testEngine.asPlayerOne().getCard(dalmatianPuppyTailWagger).playCost).toBe(
          dalmatianPuppyTailWagger.cost - 2,
        );

        expect(testEngine.asPlayerOne().getCard(flounderVoiceOfReason).playCost).toBe(
          flounderVoiceOfReason.cost,
        );
        expect(testEngine.asPlayerOne().getCard(dalmatianPuppyTailWagger).playCost).toBe(
          dalmatianPuppyTailWagger.cost - 2,
        );

        testEngine.asPlayerOne().playCard(flounderVoiceOfReason);
        expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(
          initialInkwell - flounderVoiceOfReason.cost,
        );
        expect(testEngine.asPlayerOne().getCard(dalmatianPuppyTailWagger).playCost).toBe(
          dalmatianPuppyTailWagger.cost - 2,
        );

        testEngine.asPlayerOne().playCard(dalmatianPuppyTailWagger);
        expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
      });

      it("4.3.6. Example C.", () => {
        // Example C: Lefou – Bumbler has an ability called Loyal that reads, “If you have a character named Gaston in play, you pay 1 {I} less to play this character.” This payment modifier is self-referential because it can apply only to playing that specific card. In contrast, Gadget Hackwrench – Brilliant Bosun has an ability called Mechanically Savvy that reads, “While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.” Even though Gadget has the Inventor classification, the ability doesn’t refer to itself when playing and begins to apply only when Gadget is in play.
        const initialInkwell = lefouBumbler.cost + gadgetHackwrenchBrilliantBosun.cost;
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [lefouBumbler, gadgetHackwrenchBrilliantBosun],
          play: [gastonArrogantHunter, dinglehopper, coconutBasket, eyeOfTheFates],
          inkwell: initialInkwell,
        });

        expect(testEngine.asPlayerOne().getCard(gadgetHackwrenchBrilliantBosun).playCost).toBe(
          gadgetHackwrenchBrilliantBosun.cost,
        );
        testEngine.asPlayerOne().playCard(gadgetHackwrenchBrilliantBosun);
        expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(
          initialInkwell - gadgetHackwrenchBrilliantBosun.cost,
        );
        expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
              resolveOptional: true,
              targets: [gastonArrogantHunter],
            }).success,
        ).toBe(true);

        expect(testEngine.asPlayerOne().getCard(lefouBumbler).playCost).toBe(lefouBumbler.cost - 1);
        testEngine.asPlayerOne().playCard(lefouBumbler);
        expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
      });
    });
  });
});
