// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/06-abilities-effects-and-resolving.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  dinglehopper,
  friendsOnTheOtherSide,
  healingGlow,
  minnieMouseAlwaysClassy,
  mulanImperialSoldier,
  simbaProtectiveCub,
  youHaveForgottenMe,
} from "@tcg/lorcana-cards/cards/001";
import {
  arthurWizardsApprentice,
  judyHoppsOptimisticOfficer,
  launch,
  noiOrphanedThief,
  paintingTheRosesRed,
  pawpsicle,
  princeJohnGreediestOfAll,
  ringTheBell,
  theQueenCommandingPresence,
} from "@tcg/lorcana-cards/cards/002";
import {
  cursedMerfolkUrsulasHandiwork,
  genieSupportiveFriend,
  hueySavvyNephew,
  jafarStrikingIllusionist,
  prideLandsPrideRock,
  riseOfTheTitans,
  ursulaDeceiverOfAll,
} from "@tcg/lorcana-cards/cards/003";
import {
  dodge,
  lookAtThisFamily,
  megaraCaptivatingCynic,
  thebesTheBigOlive,
  tritonYoungPrince,
} from "@tcg/lorcana-cards/cards/004";
import {
  donaldDuckPieSlinger,
  prideLandsJungleOasis,
  taffytaMuttonfudgeSourSpeedster,
} from "@tcg/lorcana-cards/cards/005";
import { genieWishFulfilled, goodJob, liloEscapeArtist } from "@tcg/lorcana-cards/cards/006";
import { showMeMore } from "@tcg/lorcana-cards/cards/007";
import { i2i } from "@tcg/lorcana-cards/cards/009";

describe("# 6. ABILITIES, EFFECTS, AND RESOLVING", () => {
  describe("# 6.1. General", () => {
    it("6.1.1. / 6.1.1.1. / 6.1.1.2. Real cards distinguish abilities from action effects.", () => {
      expect(hueySavvyNephew.abilities).toHaveLength(2);
      expect(hueySavvyNephew.abilities?.map((ability) => ability.type)).toEqual([
        "keyword",
        "triggered",
      ]);

      const challengedEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [goodJob],
          play: [{ card: minnieMouseAlwaysClassy, isDrying: false }],
        },
        {
          play: [cursedMerfolkUrsulasHandiwork],
        },
      );
      challengedEngine.asServer().manualExertCard(cursedMerfolkUrsulasHandiwork);

      expect(
        challengedEngine
          .asPlayerOne()
          .challenge(minnieMouseAlwaysClassy, cursedMerfolkUrsulasHandiwork).success,
      ).toBe(true);
      expect(challengedEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(challengedEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      const goodJobId = challengedEngine.findCardInstanceId(goodJob, "hand", PLAYER_ONE);
      expect(
        challengedEngine
          .asPlayerTwo()
          .resolvePendingByCard(challengedEngine.asPlayerTwo().getBagEffects()[0]!.sourceId)
          .success,
      ).toBe(true);
      expect(
        challengedEngine.asPlayerOne().resolveNextPending({
          targets: [goodJobId],
        }).success,
      ).toBe(true);
      expect(challengedEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

      const actionEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ringTheBell],
        inkwell: ringTheBell.cost,
        play: [{ card: minnieMouseAlwaysClassy, damage: 1 }],
      });

      expect(
        actionEngine.asPlayerOne().playCardTo(ringTheBell, minnieMouseAlwaysClassy).success,
      ).toBe(true);
      expect(actionEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(actionEngine.asPlayerOne().getCardZone(ringTheBell)).toBe("discard");
      expect(actionEngine.asPlayerOne().getCardZone(minnieMouseAlwaysClassy)).toBe("discard");
    });

    it("6.1.2. Effects resolve in sentence order and as much as possible.", () => {
      const noTargetEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [paintingTheRosesRed],
        inkwell: paintingTheRosesRed.cost,
        deck: [simbaProtectiveCub],
      });

      expect(noTargetEngine.asPlayerOne().playCard(paintingTheRosesRed)).toBeSuccessfulCommand();
      expect(noTargetEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(noTargetEngine.asPlayerOne().getCardZone(paintingTheRosesRed)).toBe("discard");

      const noDrawEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [paintingTheRosesRed],
        inkwell: paintingTheRosesRed.cost,
        deck: 0,
        play: [minnieMouseAlwaysClassy],
      });

      expect(
        noDrawEngine.asPlayerOne().playCard(paintingTheRosesRed, {
          targets: [minnieMouseAlwaysClassy],
        }).success,
      ).toBe(true);
      expect(noDrawEngine.asPlayerOne().getCardStrength(minnieMouseAlwaysClassy)).toBe(
        minnieMouseAlwaysClassy.strength - 1,
      );
      expect(noDrawEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });

    it("6.1.3. Up-to choices can't reuse one card, but separate chosen instances can.", () => {
      // Example A: Painting the Roses Red is a song action that has the effect, "Up to 2 chosen characters get -1 this turn. Draw a card."
      const upToEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [paintingTheRosesRed],
        inkwell: paintingTheRosesRed.cost,
        play: [minnieMouseAlwaysClassy],
      });

      expect(
        upToEngine.asPlayerOne().playCard(paintingTheRosesRed, {
          targets: [minnieMouseAlwaysClassy, minnieMouseAlwaysClassy],
        }).success,
      ).toBe(false);

      // Example B: The Queen - Commanding Presence has an ability called Who Is the Fairest? that reads, "Whenever this character questions, chosen opposing character gets \(-4\) this turn and chosen character gets \(+4\) this turn." The same character can be chosen for both the \(-4\) and the \(+4\) modifiers since the ability has two separate instances of the word "chosen."
      const queenEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theQueenCommandingPresence, isDrying: false }],
        },
        {
          play: [minnieMouseAlwaysClassy],
        },
      );

      expect(queenEngine.asPlayerOne().quest(theQueenCommandingPresence)).toBeSuccessfulCommand();
      const [bagEffect] = queenEngine.asPlayerOne().getBagEffects();
      expect(
        queenEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
          targets: [minnieMouseAlwaysClassy, minnieMouseAlwaysClassy],
        }).success,
      ).toBe(true);
      expect(queenEngine.asPlayerTwo().getCardStrength(minnieMouseAlwaysClassy)).toBe(
        minnieMouseAlwaysClassy.strength,
      );
    });

    it("6.1.4. Declining a may-effect doesn't stop another sentence in the same resolution.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [lookAtThisFamily],
        inkwell: lookAtThisFamily.cost,
        deck: [
          aladdinPrinceAli,
          healingGlow,
          simbaProtectiveCub,
          arielOnHumanLegs,
          minnieMouseAlwaysClassy,
          hueySavvyNephew,
        ],
      });

      expect(
        testEngine.asPlayerOne().playCard(lookAtThisFamily, {
          destinations: [
            {
              zone: "deck-bottom",
              cards: [
                minnieMouseAlwaysClassy,
                arielOnHumanLegs,
                simbaProtectiveCub,
                healingGlow,
                aladdinPrinceAli,
              ],
            },
          ],
        }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("deck");
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)[0]).toBe(hueySavvyNephew.id);
    });

    describe(`6.1.5. Some effects are considered sequential effects. These effects require a player to make a decision or pay a cost in order to resolve them. These are normally written as "[A] to [B], "[A] or [B]," or "[A]. If you do, [B]." Note that both [A] and [B] can have multiple parts.`, () => {
      it("6.1.5.1. Sequential 'if you do' and 'to' effects stop when the first part doesn't happen.", () => {
        const ifYouDoEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [judyHoppsOptimisticOfficer],
          inkwell: judyHoppsOptimisticOfficer.cost,
          deck: [simbaProtectiveCub],
          play: [pawpsicle],
        });

        expect(
          ifYouDoEngine.asPlayerOne().playCard(judyHoppsOptimisticOfficer),
        ).toBeSuccessfulCommand();

        const bagEffect = ifYouDoEngine.asPlayerOne().getBagEffects()[0]!;
        expect(
          ifYouDoEngine.asPlayerOne().resolvePendingByCard(bagEffect.sourceId, {
            resolveOptional: false,
            targets: [ifYouDoEngine.findCardInstanceId(pawpsicle, "play", PLAYER_ONE)],
          }).success,
        ).toBe(true);

        expect(ifYouDoEngine.asPlayerOne().getCardZone(pawpsicle)).toBe("play");
        expect(ifYouDoEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      });

      it("6.1.5.1. Sequential 'if you do' and 'to' effects stop when the first part doesn't happen.", () => {
        const toEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [{ card: arthurWizardsApprentice, isDrying: false }],
        });

        expect(toEngine.asPlayerOne().quest(arthurWizardsApprentice)).toBeSuccessfulCommand();
        expect(toEngine.asPlayerOne().getBagCount()).toBe(1);
        const bagEffect = toEngine.asPlayerOne().getBagEffects()[0]!;
        expect(
          toEngine.asPlayerOne().resolvePendingByCard(bagEffect.sourceId, {
            resolveOptional: false,
            targets: [toEngine.findCardInstanceId(arthurWizardsApprentice, "play", PLAYER_ONE)],
          }),
        ).toBeSuccessfulCommand();
        expect(toEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(arthurWizardsApprentice.lore);
      });

      it("6.1.5.2. 'A or B' forces the legal branch when the other branch can't be chosen.", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [megaraCaptivatingCynic],
          inkwell: megaraCaptivatingCynic.cost,
        });

        expect(testEngine.asPlayerOne().playCard(megaraCaptivatingCynic)).toBeSuccessfulCommand();
        expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
        expect(testEngine.asPlayerOne().getCardZone(megaraCaptivatingCynic)).toBe("discard");
      });
    });

    it("Launch, no items in play", () => {
      // Example A: Launch "Banish chosen item of yours to deal 5 damage to chosen character." If the player doesn't have an item in play that they can banish for the sequential effect listed in the first part of the sentence [A], they can't deal the 5 damage described in the second part of the sentence [B].
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [launch],
          inkwell: launch.cost,
        },
        {
          play: [minnieMouseAlwaysClassy],
        },
      );

      const result = testEngine
        .asPlayerOne()
        .playCard(launch, { targets: [minnieMouseAlwaysClassy] });

      expect(testEngine.asPlayerTwo().getCardZone(minnieMouseAlwaysClassy)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(launch)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCard(minnieMouseAlwaysClassy).damage).toBe(0);

      expect(result.success).toBe(true);
    });

    it("Genie - Supportive Friend", () => {
      // Example B: Genie - Supportive Friend "Whenever this character quests, you may shuffle this card into your deck to draw 3 cards." This triggered ability is added to the bag when the character quests. When the player resolves the ability from the bag, they can choose the sequential effect of shuffling the card into their deck [A]. If they do, they draw three cards from part [B]. If the player chooses not to do [A] or is unable to do part of [A] for any reason, they don't draw three cards from part [B].
      LorcanaMultiplayerTestEngine.createWithFixture({
        play: [genieSupportiveFriend],
      });
    });

    it("6.1.6. 'other' excludes Mulan from both the banish target and the reward.", () => {
      // Example: Mulan – Imperial Soldier has an ability called Lead by Example that reads, “During your turn, whenever this character banishes another character in a challenge, your other characters get +1 ♦ this turn.” Mulan must banish a character other than herself, and she doesn’t gain the benefit of this ability herself because it applies only to your “other” characters.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanImperialSoldier, minnieMouseAlwaysClassy],
        },
        {
          play: [{ card: hueySavvyNephew, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mulanImperialSoldier, hueySavvyNephew).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().getCard(mulanImperialSoldier).lore).toBe(
        mulanImperialSoldier.lore,
      );
      expect(testEngine.asPlayerOne().getCard(minnieMouseAlwaysClassy).lore).toBe(
        minnieMouseAlwaysClassy.lore + 1,
      );
    });

    it("6.1.7. Playing a card for free ignores alternate costs and delays triggered follow-ups until that play finishes.", () => {
      // Example: During the active player's turn, they have a Pride Lands – Jungle Oasis in play and a Donald Duck – Pie Slinger in their discard pile. Pride Lands is a location card and has an ability called Our Humble Home that reads, "While you have 3 or more characters here, you may banish this location to play a character from your discard for free." When the active player banishes Pride Lands with this ability, they play Donald Duck from their discard for free. Even though Donald Duck has a Shift cost, the player can't choose to pay it as an alternate cost to play him since he enters play as part of resolving Pride Lands's ability.
      const alternateCostEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          prideLandsJungleOasis,
          { card: donaldDuckPieSlinger, atLocation: prideLandsJungleOasis },
          { card: minnieMouseAlwaysClassy, atLocation: prideLandsJungleOasis },
          { card: hueySavvyNephew, atLocation: prideLandsJungleOasis },
        ],
        discard: [donaldDuckPieSlinger],
      });
      const donaldInDiscardId = alternateCostEngine.findCardInstanceId(
        donaldDuckPieSlinger,
        "discard",
        PLAYER_ONE,
      );

      expect(alternateCostEngine.asPlayerOne().activateAbility(prideLandsJungleOasis).success).toBe(
        true,
      );
      expect(
        alternateCostEngine
          .asPlayerOne()
          .resolveNextPending({ resolveOptional: true, targets: [donaldInDiscardId] }).success,
      ).toBe(true);
      expect(
        alternateCostEngine
          .getCardDefinitionIdsInZone("play", PLAYER_ONE)
          .filter((cardId) => cardId === donaldDuckPieSlinger.id),
      ).toHaveLength(2);

      const delayedTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          prideLandsJungleOasis,
          { card: minnieMouseAlwaysClassy, atLocation: prideLandsJungleOasis },
          { card: cursedMerfolkUrsulasHandiwork, atLocation: prideLandsJungleOasis },
          { card: hueySavvyNephew, atLocation: prideLandsJungleOasis },
        ],
        discard: [genieWishFulfilled],
        deck: [simbaProtectiveCub],
      });

      expect(
        delayedTriggerEngine.asPlayerOne().activateAbility(prideLandsJungleOasis).success,
      ).toBe(true);
      expect(
        delayedTriggerEngine
          .asPlayerOne()
          .resolveNextPending({ resolveOptional: true, targets: [genieWishFulfilled] }).success,
      ).toBe(true);
      expect(delayedTriggerEngine.asPlayerOne().getCardZone(prideLandsJungleOasis)).toBe("discard");
      expect(delayedTriggerEngine.asPlayerOne().getCardZone(genieWishFulfilled)).toBe("play");
      expect(delayedTriggerEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(delayedTriggerEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(delayedTriggerEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("6.1.7.a. Players can still decline an optional free-play effect after reaching its target selection step.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          prideLandsJungleOasis,
          { card: minnieMouseAlwaysClassy, atLocation: prideLandsJungleOasis },
          { card: cursedMerfolkUrsulasHandiwork, atLocation: prideLandsJungleOasis },
          { card: hueySavvyNephew, atLocation: prideLandsJungleOasis },
        ],
        discard: [donaldDuckPieSlinger],
      });
      const donaldInDiscardId = testEngine.findCardInstanceId(
        donaldDuckPieSlinger,
        "discard",
        PLAYER_ONE,
      );

      expect(testEngine.asPlayerOne().activateAbility(prideLandsJungleOasis).success).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(donaldDuckPieSlinger)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().resolveNextPending({ resolveOptional: false }).success).toBe(
        true,
      );

      expect(testEngine.asPlayerOne().getCardZone(donaldDuckPieSlinger)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(prideLandsJungleOasis)).toBe("play");
      expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Sanity-check the target would have been legal if the player had followed through.
      expect(donaldInDiscardId).toBeDefined();
    });

    it.skip('6.1.7.1. Source-material gap: no current exported real card in lorcana-cards says "use an ability for free."', () => {
      // 6.1.7.1. If an ability or effect instructs a player to use an ability "for free," the player ignores all costs needed to use the ability except for {E}.
    });

    it("6.1.8. 'For each' counts once and applies the whole count or none of it.", () => {
      // Example: Prince John - Greediest of All has an ability called I Sentence You that reads, "Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded." If the opponent discards 2 cards, then the active player may draw 2 cards. The active player can't choose to draw only 1 card. They must choose to draw either 2 cards or none at all.
      const drawAllEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnGreediestOfAll],
          hand: [youHaveForgottenMe],
          inkwell: youHaveForgottenMe.cost,
          deck: [simbaProtectiveCub, aladdinPrinceAli],
        },
        {
          hand: [minnieMouseAlwaysClassy, pawpsicle],
        },
      );

      expect(drawAllEngine.asPlayerOne().playCard(youHaveForgottenMe)).toBeSuccessfulCommand();
      expect(
        drawAllEngine.asPlayerTwo().respondWith(minnieMouseAlwaysClassy, pawpsicle).success,
      ).toBe(true);
      expect(drawAllEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        drawAllEngine
          .asPlayerOne()
          .resolvePendingByCard(drawAllEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: true,
          }).success,
      ).toBe(true);
      expect(drawAllEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

      const drawNoneEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnGreediestOfAll],
          hand: [youHaveForgottenMe],
          inkwell: youHaveForgottenMe.cost,
          deck: [simbaProtectiveCub, aladdinPrinceAli],
        },
        {
          hand: [minnieMouseAlwaysClassy, pawpsicle],
        },
      );

      expect(drawNoneEngine.asPlayerOne().playCard(youHaveForgottenMe)).toBeSuccessfulCommand();
      expect(
        drawNoneEngine.asPlayerTwo().respondWith(minnieMouseAlwaysClassy, pawpsicle).success,
      ).toBe(true);
      expect(
        drawNoneEngine
          .asPlayerOne()
          .resolvePendingByCard(drawNoneEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: false,
          }).success,
      ).toBe(true);
      expect(drawNoneEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });

    it.skip("6.1.10. Loop shortcutting is procedural guidance here; this file does not expose a stable deterministic real-card loop.", () => {});

    it("Example 6.1.11 'That song' tracks the exact sung card and fails after it changes zones.", () => {
      // Example: Ursula – Deceiver of All's ability What a Deal reads, “Whenever this character sings a song, you may play that song again from your discard for free. If you do, put that card on the bottom of your deck instead of into your discard.” Here, “that song” refers to the card sung by Ursula and not to any other song card that's in her player's discard pile.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [friendsOnTheOtherSide],
        play: [ursulaDeceiverOfAll],
      });

      testEngine.asPlayerOne().singSong(friendsOnTheOtherSide, ursulaDeceiverOfAll);

      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toEqual(2);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toEqual(4);
    });

    it("Example 6.1.11.1. 'That song' tracks the exact sung card and fails after it changes zones.", () => {
      // Example: A player has 2 copies of Ursula – Deceiver of All in play and exerts them both to sing a song using its Sing Together ability. Ursula's ability What a Deal reads, "Whenever this character sings a song, you may play that song again from your discard for free. If you do, put that card on the bottom of your deck instead of into your discard." Because both copies of Ursula were exerted to sing together, both of their What a Deal abilities are triggered and added to the bag to be resolved.
      // When the first triggered ability resolves, the song card played using Sing Together is put on the bottom of its player's deck.
      // When the second triggered ability resolves, "that song" card is no longer in the discard, so that part of the effect resolves with no effect. Similarly, "that song" refers to a song card that's no longer in the discard, so the latter part of the effect also does nothing. Even if there's another song card with the same name in the discard, "that song" refers only to the specific song card that was sung by Ursula when the triggered abilities were added to the bag, not any other song card with the same name.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [i2i],
        discard: [i2i],
        play: [
          { card: ursulaDeceiverOfAll, isDrying: false },
          { card: ursulaDeceiverOfAll, isDrying: false },
          { card: mulanImperialSoldier, isDrying: false },
        ],
        deck: [simbaProtectiveCub, aladdinPrinceAli, arielOnHumanLegs, healingGlow],
      });

      const sungSongId = testEngine.findCardInstanceId(i2i, "hand", PLAYER_ONE);
      const otherSongId = testEngine.findCardInstanceId(i2i, "discard", PLAYER_ONE);
      const ursulaSingerIds = testEngine
        .getCardInstanceIdsInZone("play", PLAYER_ONE)
        .filter((cardId) => testEngine.getCardDefinitionId(cardId) === ursulaDeceiverOfAll.id);
      const mulanSingerId = testEngine.findCardInstanceId(mulanImperialSoldier, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toEqual(0);
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toEqual(1);

      expect(
        testEngine.asPlayerOne().playSongTogether(i2i, [...ursulaSingerIds, mulanSingerId]),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toEqual(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

      const [firstBag, secondBag] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(firstBag!.sourceId, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toEqual(4);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(4);
      expect(testEngine.asServer().getCardZone(sungSongId)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(otherSongId)).toBe("discard");

      expect(
        // The second trigger should resolve with invalid target, resulting in no effect
        testEngine.asPlayerOne().resolvePendingByCard(secondBag!.sourceId, {
          resolveOptional: true,
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toEqual(4);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(4);
      expect(testEngine.asServer().getCardZone(sungSongId)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(otherSongId)).toBe("discard");
    });

    it("6.1.12. Abilities can function from discard when their printed text says so.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        discard: [liloEscapeArtist],
        inkwell: liloEscapeArtist.cost,
      });

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("6.1.13.1. 'During' applies only in the stated turn window.", () => {
      // Example: Triton - Young Prince has an ability called Superior Swimmer that reads, "During your turn, this character gains Evasive. (They can challenge characters with Evasive.) This ability applies only if it's the turn of the player who has Triton in play. If it's the turn of any other player, this ability doesn't apply.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tritonYoungPrince],
      });

      expect(testEngine.asPlayerOne().hasKeyword(tritonYoungPrince, "Evasive")).toBe(true);
      testEngine.asPlayerOne().passTurn();
      expect(testEngine.asPlayerTwo().hasKeyword(tritonYoungPrince, "Evasive")).toBe(false);
    });

    it("6.1.13.2. 'Once' resolves only a single time in the stated period.", () => {
      // Example: Taffyta Muttonfudge - Sour Speedster has an ability called New Roster that reads, "Once per turn, when this character moves to a location, gain 2 lore." The active player moves Taffyta Muttonfudge to a location and the triggered ability is added to the bag. When the triggered ability resolves from the bag, it checks to see if this effect has already resolved this turn. It hasn't, so the effect resolves as normal. Then the active player moves Taffyta Muttonfudge to another location and the triggered ability is added to the bag. When the ability resolves and checks, it has resolved already this turn, so it resolves with no effect. If the active player has a second Taffyta and moves her to a location, her ability checks only whether that particular ability has resolved, instead of any ability named New Roster. Since this is the first time the ability of the second copy of Taffyta checks to see if that particular ability has resolved, it resolves as normal.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [taffytaMuttonfudgeSourSpeedster, prideLandsPrideRock, thebesTheBigOlive],
        inkwell: prideLandsPrideRock.moveCost + thebesTheBigOlive.moveCost,
      });

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(taffytaMuttonfudgeSourSpeedster, prideLandsPrideRock),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(taffytaMuttonfudgeSourSpeedster, thebesTheBigOlive),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
    });

    it("6.1.13.3. 'Until' lasts through the specified future moment.", () => {
      // Example: Dodge! is an action that has the effect, "Chosen character gains Ward and Evasive until the start of your next turn." Once the action is finished resolving, the chosen character gains those keywords. The character loses them at the start of their player's next turn.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [dodge],
        inkwell: dodge.cost,
        play: [minnieMouseAlwaysClassy],
      });

      expect(
        testEngine.asPlayerOne().playCard(dodge, { targets: [minnieMouseAlwaysClassy] }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseAlwaysClassy, "Ward")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(true);

      testEngine.asPlayerOne().passTurn();
      expect(testEngine.asPlayerTwo().hasKeyword(minnieMouseAlwaysClassy, "Ward")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(true);

      testEngine.asPlayerTwo().passTurn();
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseAlwaysClassy, "Ward")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(false);
    });

    it("6.1.13.4. 'This turn' ends during that turn's end step.", () => {
      // Example: Good Job! is an action that has the effect, "Chosen character gets \(+1 \diamond\) this turn." As soon as the action resolves the effect, the character gets the \(+1 \diamond\) for the rest of the turn. The character loses the \(+1 \diamond\) during the player's End-of-Turn Phase.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [goodJob],
        inkwell: goodJob.cost,
        play: [minnieMouseAlwaysClassy],
      });

      expect(
        testEngine.asPlayerOne().playCard(goodJob, { targets: [minnieMouseAlwaysClassy] }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getCard(minnieMouseAlwaysClassy).lore).toBe(
        minnieMouseAlwaysClassy.lore + 1,
      );

      testEngine.asPlayerOne().passTurn();
      expect(testEngine.asPlayerTwo().getCard(minnieMouseAlwaysClassy).lore).toBe(
        minnieMouseAlwaysClassy.lore,
      );
    });

    describe("6.1.13.5. 'While' applies only while the stated condition remains true.", () => {
      it("Example", () => {
        const notHereEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [donaldDuckPieSlinger, thebesTheBigOlive],
          },
          {
            play: [hueySavvyNephew],
          },
        );
        notHereEngine.asServer().manualExertCard(hueySavvyNephew);

        expect(
          notHereEngine.asPlayerOne().challenge(donaldDuckPieSlinger, hueySavvyNephew).success,
        ).toBe(true);
        expect(notHereEngine.asPlayerOne().getBagCount()).toBe(0);
      });

      it("Example", () => {
        const whileHereEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [
              { card: donaldDuckPieSlinger, atLocation: thebesTheBigOlive, isDrying: false },
              thebesTheBigOlive,
            ],
          },
          {
            play: [hueySavvyNephew],
          },
        );
        whileHereEngine.asServer().manualExertCard(hueySavvyNephew);

        expect(
          whileHereEngine.asPlayerOne().challenge(donaldDuckPieSlinger, hueySavvyNephew).success,
        ).toBe(true);
        expect(whileHereEngine.asPlayerOne().getBagCount()).toBe(0);
        expect(whileHereEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
      });

      it("Example A", () => {
        // Example A: Noi – Orphaned Thief has an ability called Hide and Seek that reads, "While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)" As long as the player who has Noi in play also has an item in play, the ability applies. Once the item leaves play, Noi's ability no longer applies.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [noiOrphanedThief, dinglehopper],
          hand: [riseOfTheTitans],
          inkwell: riseOfTheTitans.cost,
        });

        expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Ward")).toBe(true);
        expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Resist")).toBe(true);

        testEngine.asPlayerOne().playCard(riseOfTheTitans, { targets: [dinglehopper] });

        expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Ward")).toBe(false);
        expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Resist")).toBe(false);
      });

      it("Example B", () => {
        // Example B: Pride Lands - Pride Rock has an ability called We Are All Connected that reads, "Characters get \(+2\) while here." If a character is at this location, they get the \(+2\) . If the location leaves play or the character moves to another location, the character immediately loses the Willpower gained from the ability.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [{ card: noiOrphanedThief, atLocation: prideLandsPrideRock }, prideLandsPrideRock],
          hand: [riseOfTheTitans],
          inkwell: riseOfTheTitans.cost,
        });

        expect(testEngine.asPlayerOne().getCard(noiOrphanedThief).willpower).toBe(
          noiOrphanedThief.willpower + 2,
        );

        testEngine.asPlayerOne().playCard(riseOfTheTitans, { targets: [prideLandsPrideRock] });

        expect(testEngine.asPlayerOne().getCard(noiOrphanedThief).willpower).toBe(
          noiOrphanedThief.willpower,
        );
      });
    });

    describe("6.1.13.6. Combined durations apply only while all of their conditions stay true.", () => {
      it("Example B", () => {
        // Example B: Thebes – The Big Olive is a location that has an ability called If You Can Make It Here. . . . It reads, “During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.” The triggered ability happens only if it's the turn of the player who has Thebes in play and only if a character at Thebes banishes another character in a challenge. If either condition is false—if it's an opponent's turn, for example—the triggered ability doesn't happen and isn't added to the bag.
        const thebesEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [
              { card: donaldDuckPieSlinger, atLocation: thebesTheBigOlive, isDrying: false },
              { card: simbaProtectiveCub, isDrying: false },
              thebesTheBigOlive,
            ],
          },
          {
            play: [hueySavvyNephew, hueySavvyNephew],
          },
        );
        thebesEngine.asServer().manualExertCard(hueySavvyNephew);

        expect(
          thebesEngine.asPlayerOne().challenge(donaldDuckPieSlinger, hueySavvyNephew).success,
        ).toBe(true);
        expect(thebesEngine.asPlayerOne().getBagCount()).toBe(0);
        expect(thebesEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
        thebesEngine.asServer().manualExertCard(hueySavvyNephew);

        expect(
          thebesEngine.asPlayerOne().challenge(simbaProtectiveCub, hueySavvyNephew).success,
        ).toBe(true);
        expect(thebesEngine.asPlayerOne().getBagCount()).toBe(0);
      });

      it.skip("Example A", () => {
        // Example A: Jafar - Striking Illusionist has an ability called Power Beyond Measure that reads, "During your turn, while this character is exerted, whenever you draw a card, gain 1 lore." The triggered ability happens only if it's the turn of the player who has Jafar in play and if Jafar is exerted. If either condition is false—if Jafar is ready, for example—the triggered ability won't happen and isn't added to the bag.
        const exertedEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
          deck: [aladdinPrinceAli, arielOnHumanLegs],
          play: [{ card: jafarStrikingIllusionist, isDrying: false }],
        });
        const exertedJafarId = exertedEngine.findCardInstanceId(
          jafarStrikingIllusionist,
          "play",
          PLAYER_ONE,
        );
        exertedEngine.asServer().manualExertCard(exertedJafarId);

        expect(exertedEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();
        expect(exertedEngine.asPlayerOne().getBagCount()).toBe(2);
        // Resolve pending bag effects via bounded bag draining if this sequence needs to be re-enabled.
        expect(exertedEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);

        const readyEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
          deck: [aladdinPrinceAli, arielOnHumanLegs],
          play: [{ card: jafarStrikingIllusionist, isDrying: false }],
        });

        expect(readyEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();
        expect(readyEngine.asPlayerOne().getBagCount()).toBe(0);
        expect(readyEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

        const offTurnEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [{ card: jafarStrikingIllusionist, isDrying: false }],
          },
          {
            hand: [showMeMore],
            inkwell: showMeMore.cost,
            deck: [aladdinPrinceAli, arielOnHumanLegs, minnieMouseAlwaysClassy],
          },
        );
        const offTurnJafarId = offTurnEngine.findCardInstanceId(
          jafarStrikingIllusionist,
          "play",
          PLAYER_ONE,
        );
        offTurnEngine.asServer().manualExertCard(offTurnJafarId);

        expect(offTurnEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
        expect(offTurnEngine.asPlayerTwo().playCard(showMeMore)).toBeSuccessfulCommand();
        expect(offTurnEngine.asPlayerOne().getBagCount()).toBe(0);
        expect(offTurnEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      });
    });

    it.skip("6.1.14. Reveals stay limited to the looked-at group and end when resolution finishes.", () => {
      // Example: The song Look at This Family has an effect that reads, "Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order." The cards the player chooses to reveal can only come from the top 5 cards the player looked at. The player can't choose to reveal any cards from any other group of cards.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [lookAtThisFamily],
        inkwell: lookAtThisFamily.cost,
        deck: [
          aladdinPrinceAli,
          healingGlow,
          simbaProtectiveCub,
          arielOnHumanLegs,
          minnieMouseAlwaysClassy,
          hueySavvyNephew,
        ],
      });

      expect(
        testEngine.asPlayerOne().playCard(lookAtThisFamily, {
          destinations: [
            {
              zone: "hand",
              cards: [aladdinPrinceAli, hueySavvyNephew],
            },
            {
              zone: "deck-bottom",
              cards: [minnieMouseAlwaysClassy, arielOnHumanLegs, simbaProtectiveCub, healingGlow],
            },
          ],
        }),
      ).toBeSuccessfulCommand();
    });
  });
});
