// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/03-turn-structure.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  fanTheFlames,
  dukeOfWeseltonOpportunisticOfficial,
  jumbaJookibaRenegadeScientist,
  liloMakingAWish,
  minnieMouseAlwaysClassy,
  sergeantTibbsCourageousCat,
  stealFromTheRich,
  dinglehopper,
  mickeyMouseTrueFriend,
  theQueenWickedAndVain,
  ransack,
} from "@tcg/lorcana-cards/cards/001";
import { cobraBubblesJustASocialWorker, youCanFly } from "@tcg/lorcana-cards/cards/002";
import {
  docBoldKnight,
  pachaEmperorsGuide,
  sirEctorCastleLord,
  tipoGrowingSon,
} from "@tcg/lorcana-cards/cards/005";
import { candyDrift } from "@tcg/lorcana-cards/cards/008";
import {
  casaMadrigalCasita,
  cruellaDeVilFashionableCruiser,
  hiddenCoveTranquilHaven,
  motunuiIslandParadise,
} from "@tcg/lorcana-cards/cards/009";
import { flintheartGlomgoldLoneCheater } from "@tcg/lorcana-cards/cards/003";
import { pigletCocoaMaker, scroogeMcduckEbenezerScrooge } from "@tcg/lorcana-cards/cards/011";
import { judyHoppsResourcefulRabbit } from "@tcg/lorcana-cards/cards/006";

describe("#### 3. TURN STRUCTURE", () => {
  describe("3.2. Start-of-Turn Phase", () => {
    it("3.2.1.1. The active player readies all their cards in play and in their inkwell.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseAlwaysClassy],
        inkwell: [liloMakingAWish],
      });

      testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy);
      testEngine.asServer().manualExertCard(minnieMouseAlwaysClassy);
      testEngine.asServer().manualExertCard(liloMakingAWish);

      expect(testEngine.asPlayerOne().isExerted(minnieMouseAlwaysClassy)).toBe(true);
      expect(testEngine.asPlayerOne().isExerted(liloMakingAWish)).toBe(true);

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().isExerted(minnieMouseAlwaysClassy)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(liloMakingAWish)).toBe(false);
    });

    it("3.2.1.2. Effects that apply “during your turn” start applying.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flintheartGlomgoldLoneCheater],
        },
        {
          play: [cruellaDeVilFashionableCruiser],
        },
      );

      expect(testEngine.asPlayerOne().getCard(flintheartGlomgoldLoneCheater).hasEvasive).toBe(true);
      expect(testEngine.asPlayerOne().getCard(cruellaDeVilFashionableCruiser).hasEvasive).toBe(
        false,
      );

      testEngine.asPlayerOne().passTurn();

      expect(testEngine.asPlayerTwo().getCard(flintheartGlomgoldLoneCheater).hasEvasive).toBe(
        false,
      );
      expect(testEngine.asPlayerTwo().getCard(cruellaDeVilFashionableCruiser).hasEvasive).toBe(
        true,
      );
    });

    it("3.2.1.3. Effects that end at “the start of your turn” or at “the start of your next turn” end.  ", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [youCanFly],
        inkwell: youCanFly.cost,
        play: [minnieMouseAlwaysClassy],
      });

      testEngine.asPlayerOne().playCard(youCanFly, { targets: [minnieMouseAlwaysClassy] });
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(true);

      testEngine.asPlayerOne().passTurn();
      expect(testEngine.asPlayerTwo().hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(true);

      testEngine.asPlayerTwo().passTurn();
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(false);
    });

    it("3.2.1.4. Triggered abilities that happen “at the start of your turn” or that occur at any time during the Ready step are added to the bag but don’t yet resolve.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: minnieMouseAlwaysClassy, atLocation: casaMadrigalCasita },
          pachaEmperorsGuide,
          casaMadrigalCasita,
          dinglehopper,
        ],
      });

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(3);
    });

    it("3.2.2.1. The active player’s characters that are in play are no longer “drying” and will be able to quest, challenge, or {E} to pay costs for activated abilities or song cards. ", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseAlwaysClassy],
        inkwell: minnieMouseAlwaysClassy.cost,
      });

      testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy);
      expect(testEngine.asPlayerOne().getCard(minnieMouseAlwaysClassy).drying).toBe(true);

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getCard(minnieMouseAlwaysClassy).drying).toBe(false);
    });

    it("3.2.2.2. The active player gains lore from locations they have in play with a {L} characteristic. This isn’t a triggered ability and doesn’t use the bag.   ", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [motunuiIslandParadise],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      testEngine.asPlayerOne().passTurn();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      testEngine.asPlayerTwo().passTurn();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(motunuiIslandParadise.lore);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("3.2.2.3. The active player resolves any triggered abilities in the bag that were added during the Set step or the Ready step.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: minnieMouseAlwaysClassy, atLocation: casaMadrigalCasita },
          pachaEmperorsGuide,
          casaMadrigalCasita,
          dinglehopper,
        ],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBe(3);
      expect(testEngine.asServer().getCurrentPhase()).toBe("beginning");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pachaEmperorsGuide, { bagIndex: 0 }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      expect(testEngine.asServer().getCurrentPhase()).toBe("beginning");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pachaEmperorsGuide),
      ).toBeSuccessfulCommand();
      // After resolving 2nd effect, the last mandatory no-target effect auto-resolves
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asServer().getCurrentPhase()).toBe("main");
    });

    it("3.2.3.1. The active player draws a card from their deck. If this turn is the first turn of the game, the starting player skips this step.   ", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 10,
        },
        {
          deck: 10,
        },
      );

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(0);

      testEngine.asPlayerOne().passTurn();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);

      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    });
  });

  describe("#### 3.3. Main Phase", () => {
    describe("3.3.2.1. If the active player is performing a turn action and/or there are abilities in the bag waiting to resolve, the active player can’t declare the end of their turn and move to the End-of-Turn phase until the turn action is fully complete and there are no more abilities in the bag waiting to resolve.", () => {
      it("Doesn't let execute game actions while bag is not empty", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [tipoGrowingSon, mickeyMouseTrueFriend, sirEctorCastleLord],
            inkwell: tipoGrowingSon.cost + sirEctorCastleLord.cost,
            play: [minnieMouseAlwaysClassy, theQueenWickedAndVain, hiddenCoveTranquilHaven],
          },
          {
            play: [docBoldKnight],
          },
        );

        testEngine.asServer().manualExertCard(docBoldKnight);

        // Intentionally not passing a target to the play-card effect, so Tipo's ability goes to the bag
        testEngine.asPlayerOne().playCard(tipoGrowingSon);
        expect(testEngine.getCard(tipoGrowingSon).zone).toBe("play");
        expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

        // Now we check that we can't execute actions while there's a pending effect on the bag
        expect(testEngine.asPlayerOne().ink(mickeyMouseTrueFriend)).toEqual(
          expect.objectContaining({ errorCode: "BAG_PENDING" }),
        );
        expect(testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain)).toEqual(
          expect.objectContaining({ errorCode: "BAG_PENDING" }),
        );
        expect(testEngine.asPlayerOne().playCard(sirEctorCastleLord)).toEqual(
          expect.objectContaining({ errorCode: "BAG_PENDING" }),
        );
        expect(testEngine.asPlayerOne().quest(minnieMouseAlwaysClassy)).toEqual(
          expect.objectContaining({ errorCode: "BAG_PENDING" }),
        );
        expect(testEngine.asPlayerOne().passTurn()).toEqual(
          expect.objectContaining({ errorCode: "PASS_TURN_DECISION_PENDING" }),
        );
        expect(
          testEngine
            .asPlayerOne()
            .moveCharacterToLocation(theQueenWickedAndVain, hiddenCoveTranquilHaven),
        ).toEqual(expect.objectContaining({ errorCode: "BAG_PENDING" }));

        expect(testEngine.asPlayerOne().challenge(theQueenWickedAndVain, docBoldKnight)).toEqual(
          expect.objectContaining({ errorCode: "BAG_PENDING" }),
        );
      });

      it("Doesn't let execute game actions while there's a pending effect to resolve", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [tipoGrowingSon, mickeyMouseTrueFriend, sirEctorCastleLord, ransack],
            inkwell: ransack.cost + sirEctorCastleLord.cost,
            play: [minnieMouseAlwaysClassy, theQueenWickedAndVain, hiddenCoveTranquilHaven],
          },
          {
            play: [docBoldKnight],
          },
        );

        testEngine.asServer().manualExertCard(docBoldKnight);

        // Intentionally not passing a target to the play-card effect, so ransack's effect is pending
        testEngine.asPlayerOne().playCard(ransack);
        expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
        expect(testEngine.asPlayerOne().getPendingEffects()[0]).toEqual(
          expect.objectContaining({
            type: "discard-choice",
            source: "game",
          }),
        );
        expect(testEngine.asPlayerOne().getPendingChoice()).toEqual(
          expect.objectContaining({
            type: "action-effect",
            playerID: PLAYER_ONE,
          }),
        );

        // Now we check that we can't execute actions while there's a pending effect on the bag
        expect(testEngine.asPlayerOne().ink(mickeyMouseTrueFriend)).toEqual(
          expect.objectContaining({ errorCode: "EFFECT_PENDING" }),
        );
        expect(testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain)).toEqual(
          expect.objectContaining({ errorCode: "EFFECT_PENDING" }),
        );
        expect(testEngine.asPlayerOne().playCard(sirEctorCastleLord)).toEqual(
          expect.objectContaining({ errorCode: "EFFECT_PENDING" }),
        );
        expect(testEngine.asPlayerOne().quest(minnieMouseAlwaysClassy)).toEqual(
          expect.objectContaining({ errorCode: "EFFECT_PENDING" }),
        );
        expect(
          testEngine
            .asPlayerOne()
            .moveCharacterToLocation(theQueenWickedAndVain, hiddenCoveTranquilHaven),
        ).toEqual(expect.objectContaining({ errorCode: "EFFECT_PENDING" }));
        expect(testEngine.asPlayerOne().challenge(theQueenWickedAndVain, docBoldKnight)).toEqual(
          expect.objectContaining({ errorCode: "EFFECT_PENDING" }),
        );
        expect(testEngine.asPlayerOne().passTurn()).toEqual(
          expect.objectContaining({ errorCode: "PASS_TURN_DECISION_PENDING" }),
        );
      });
    });
  });

  describe("#### 3.4. End-of-Turn Phase", () => {
    it("3.4.1.1. First, triggered abilities that would occur “At the end of the turn” and “At the end of your turn” are added to and resolve from the bag.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pigletCocoaMaker, scroogeMcduckEbenezerScrooge, judyHoppsResourcefulRabbit],
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(3);
      expect(testEngine.asPlayerOne().getCurrentPhase()).toBe("end");
    });

    it("3.4.1.2. Second, effects that would end at the end of the active player’s turn end. This includes effects with a stated duration of “this turn” (e.g., Support). Any triggered abilities that would occur are added to and resolve from the bag.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fanTheFlames],
        inkwell: fanTheFlames.cost,
        play: [minnieMouseAlwaysClassy],
        deck: [sergeantTibbsCourageousCat],
      });

      expect(
        testEngine.asServer().manualExertCard(minnieMouseAlwaysClassy),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().playCard(fanTheFlames, { targets: [minnieMouseAlwaysClassy] })
          .success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getCard(minnieMouseAlwaysClassy).hasQuestRestriction).toBe(
        true,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(minnieMouseAlwaysClassy).hasQuestRestriction).toBe(
        false,
      );
    });

    it("3.4.2. Once there are no more triggered abilities to resolve from the bag, the turn ends for the active player and there is a final game state check (see 1.9.1). Then, the next player becomes the active player and starts their turn.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [candyDrift, stealFromTheRich],
          inkwell: candyDrift.cost,
          play: [minnieMouseAlwaysClassy],
          deck: [sergeantTibbsCourageousCat, dukeOfWeseltonOpportunisticOfficial],
        },
        {
          deck: [jumbaJookibaRenegadeScientist, cobraBubblesJustASocialWorker],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(candyDrift, { targets: [minnieMouseAlwaysClassy] })
          .success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.getActivePlayer()).toBe(PLAYER_TWO);
      expect(testEngine.getCurrentPhase()).toBe("main");
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    });
  });
});
