// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/06-abilities-effects-and-resolving.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  dinglehopper,
  fireTheCannons,
  heiheiBoatSnack,
  johnSilverAlienPirate,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import {
  beastSelflessProtector,
  donaldDuckSleepwalker,
  improvise,
  letTheStormRageOn,
  motherGothelWitheredAndWicked,
  pawpsicle,
} from "@tcg/lorcana-cards/cards/002";
import { divebomb } from "@tcg/lorcana-cards/cards/003";
import { mulanInjuredSoldier } from "@tcg/lorcana-cards/cards/004";
import {
  arthurNoviceSparrow,
  royalTantrum,
  sevenDwarfsMineSecureFortress,
  sleepySluggishKnight,
} from "@tcg/lorcana-cards/cards/005";
import {
  minnieMouseStoryteller,
  restoringTheHeart,
  theReturnOfHercules,
} from "@tcg/lorcana-cards/cards/007";
import { eeyoreOverstuffedDonkey, maxGoofChartTopper } from "@tcg/lorcana-cards/cards/009";
import { getToSafety, sleepyHollowTheBridge } from "@tcg/lorcana-cards/cards/010";

function resolveOnlyBagEffect(
  player: ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>,
  params: Parameters<typeof player.resolveBag>[1] = {},
): void {
  const [bagEffect] = player.getBagEffects();
  expect(bagEffect).toBeDefined();
  expect(player.resolvePendingByCard(bagEffect!.sourceId, params)).toBeSuccessfulCommand();
}

function getPendingChoicePlayerId(testEngine: LorcanaMultiplayerTestEngine): string | undefined {
  return testEngine.asServer().getState().ctx.priority.pendingChoice?.playerID;
}

function getPendingActionEffects(testEngine: LorcanaMultiplayerTestEngine): readonly unknown[] {
  return testEngine.asServer().getState().G.pendingEffects ?? [];
}

describe("# 6. ABILITIES, EFFECTS, AND RESOLVING", () => {
  describe("# 6.7. Resolving Cards and Effects", () => {
    it("6.7.1.1. Characters, items, and locations resolve by entering play.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [arielOnHumanLegs, dinglehopper, sleepyHollowTheBridge],
        inkwell: arielOnHumanLegs.cost + dinglehopper.cost + sleepyHollowTheBridge.cost,
      });

      expect(testEngine.asPlayerOne().playCard(arielOnHumanLegs)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(dinglehopper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(sleepyHollowTheBridge)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("6.7.1.2. Actions resolve immediately and then go to discard.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [arielOnHumanLegs],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [arielOnHumanLegs],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("6.7.2.1. For-each counts on resolution, and a later if-check sees earlier changes in the same effect.", () => {
      const forEachEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [royalTantrum],
        inkwell: royalTantrum.cost,
        play: [dinglehopper, pawpsicle],
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend],
      });

      expect(
        forEachEngine.asPlayerOne().playCard(royalTantrum, {
          targets: [dinglehopper, pawpsicle],
        }).success,
      ).toBe(true);

      expect(forEachEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("discard");
      expect(forEachEngine.asPlayerOne().getCardZone(pawpsicle)).toBe("discard");
      expect(forEachEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

      const conditionalEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [getToSafety],
        inkwell: getToSafety.cost,
        discard: [sleepyHollowTheBridge],
        deck: [simbaProtectiveCub],
      });

      const sleepyHollowId = conditionalEngine.findCardInstanceId(
        sleepyHollowTheBridge,
        "discard",
        PLAYER_ONE,
      );

      expect(
        conditionalEngine.asPlayerOne().playCard(getToSafety, {
          targets: [sleepyHollowId],
        }).success,
      ).toBe(true);

      expect(conditionalEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("play");
      expect(conditionalEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("6.7.2.2. Replacement effects are applied before the effect's instructions are followed.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: [heiheiBoatSnack, mickeyMouseTrueFriend],
          play: [sevenDwarfsMineSecureFortress, { card: sleepySluggishKnight, isDrying: false }],
        },
        {
          play: [
            { card: beastSelflessProtector, isDrying: false },
            { card: simbaProtectiveCub, isDrying: false },
          ],
        },
      );

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(sleepySluggishKnight, sevenDwarfsMineSecureFortress).success,
      ).toBe(true);
      resolveOnlyBagEffect(testEngine.asPlayerOne(), {
        resolveOptional: true,
        targets: [simbaProtectiveCub],
      });

      expect(testEngine.asPlayerTwo().getDamage(beastSelflessProtector)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("play");
    });

    it("6.7.2.3. Damage is modified before it gets applied.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [eeyoreOverstuffedDonkey],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [eeyoreOverstuffedDonkey],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);
      expect(testEngine.asPlayerTwo().getCardZone(eeyoreOverstuffedDonkey)).toBe("play");
    });

    it("6.7.2.4. Effects follow written order and keep going when an earlier instruction does as much as possible.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [restoringTheHeart],
        inkwell: restoringTheHeart.cost,
        play: [sleepyHollowTheBridge],
        deck: [simbaProtectiveCub],
      });

      expect(
        testEngine.asPlayerOne().playCard(restoringTheHeart, {
          targets: [sleepyHollowTheBridge],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getDamage(sleepyHollowTheBridge)).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("6.7.3. Triggered abilities that occur during resolution wait in the bag until the full card finishes resolving.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theReturnOfHercules, simbaProtectiveCub],
          inkwell: theReturnOfHercules.cost,
          play: [minnieMouseStoryteller],
        },
        {
          hand: [mickeyMouseTrueFriend],
        },
      );

      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(theReturnOfHercules)).toBeSuccessfulCommand();
      expect(getPendingChoicePlayerId(testEngine)).toBe(PLAYER_ONE);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(theReturnOfHercules, {
          resolveOptional: true,
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
      expect(testEngine.asPlayerOne().getCard(minnieMouseStoryteller).lore).toBe(
        minnieMouseStoryteller.lore,
      );
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(getPendingChoicePlayerId(testEngine)).toBe(PLAYER_TWO);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: false,
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(testEngine.asPlayerOne().getCard(minnieMouseStoryteller).lore).toBe(
        minnieMouseStoryteller.lore,
      );

      resolveOnlyBagEffect(testEngine.asPlayerOne());
      expect(testEngine.asPlayerOne().getCard(minnieMouseStoryteller).lore).toBe(
        minnieMouseStoryteller.lore + 1,
      );
    });

    it("6.7.4. A game state check happens after each effect, so a later effect still continues after a banish.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [letTheStormRageOn],
          inkwell: letTheStormRageOn.cost,
          deck: [simbaProtectiveCub],
        },
        {
          play: [minnieMouseStoryteller],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(letTheStormRageOn, {
          targets: [minnieMouseStoryteller],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getCardZone(minnieMouseStoryteller)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("6.7.5. Multi-player choices inside one resolving effect happen in turn order and stay one resolution until all players act.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theReturnOfHercules, simbaProtectiveCub],
          inkwell: theReturnOfHercules.cost,
        },
        {
          hand: [mickeyMouseTrueFriend],
        },
      );

      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", PLAYER_ONE);
      const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(theReturnOfHercules)).toBeSuccessfulCommand();
      expect(getPendingActionEffects(testEngine)).toHaveLength(1);
      expect(getPendingChoicePlayerId(testEngine)).toBe(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(theReturnOfHercules, {
          resolveOptional: true,
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
      expect(getPendingActionEffects(testEngine)).toHaveLength(1);
      expect(getPendingChoicePlayerId(testEngine)).toBe(PLAYER_TWO);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: true,
          targets: [mickeyId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(theReturnOfHercules)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
      expect(getPendingActionEffects(testEngine)).toHaveLength(0);
      expect(getPendingChoicePlayerId(testEngine)).toBeUndefined();
    });

    it("6.7.6. Divebomb uses the sacrificed character's last known strength after it leaves play.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [improvise, divebomb],
          inkwell: improvise.cost + divebomb.cost,
          play: [arthurNoviceSparrow],
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      const arthurId = testEngine.findCardInstanceId(arthurNoviceSparrow, "play", PLAYER_ONE);
      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(improvise, {
          targets: [arthurId],
        }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getCardStrength(arthurNoviceSparrow)).toBe(3);

      expect(
        testEngine.asPlayerOne().playCard(divebomb, {
          targets: [arthurId],
        }).success,
      ).toBe(true);
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(arthurNoviceSparrow)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    });

    it("6.7.7. A character played during another effect creates triggers that wait until the parent action is done.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theReturnOfHercules, johnSilverAlienPirate],
          inkwell: theReturnOfHercules.cost,
        },
        {
          hand: [mickeyMouseTrueFriend],
          play: [simbaProtectiveCub],
          deck: 2,
        },
      );

      const johnSilverId = testEngine.findCardInstanceId(johnSilverAlienPirate, "hand", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(theReturnOfHercules)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingEffect(theReturnOfHercules, {
          resolveOptional: true,
          targets: [johnSilverId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(johnSilverAlienPirate)).toBe("play");
      expect(testEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: false,
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(testEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);
    });

    it("6.7.7.1. A child action played during another effect resolves before triggers from that play leave the bag.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: maxGoofChartTopper, isDrying: false },
            { card: donaldDuckSleepwalker, isDrying: false },
          ],
          discard: [letTheStormRageOn],
          deck: [simbaProtectiveCub],
        },
        {
          play: [minnieMouseStoryteller],
        },
      );

      const stormId = testEngine.findCardInstanceId(letTheStormRageOn, "discard", PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(maxGoofChartTopper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      resolveOnlyBagEffect(testEngine.asPlayerOne(), {
        resolveOptional: true,
        targets: [stormId],
      });
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [minnieMouseStoryteller],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getCardZone(minnieMouseStoryteller)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(letTheStormRageOn)).toBe("deck");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        donaldDuckSleepwalker.strength + 2,
      );
    });

    it("6.7.8. Enters-play damage is part of entering play, with no follow-up bag item or delayed damage step.", () => {
      // Example: Mother Gothel – Withered and Wicked has an ability called What Have You Done?! that reads, “This character enters play with 3 damage.” The effect resolves as Mother Gothel is put into play. There’s no moment within the game in which Mother Gothel enters play with no damage on her.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [motherGothelWitheredAndWicked, mulanInjuredSoldier],
        inkwell: motherGothelWitheredAndWicked.cost + mulanInjuredSoldier.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(motherGothelWitheredAndWicked),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(motherGothelWitheredAndWicked)).toBe("play");
      expect(testEngine.asPlayerOne().getDamage(motherGothelWitheredAndWicked)).toBe(3);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().playCard(mulanInjuredSoldier)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanInjuredSoldier)).toBe("play");
      expect(testEngine.asPlayerOne().getDamage(mulanInjuredSoldier)).toBe(2);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
