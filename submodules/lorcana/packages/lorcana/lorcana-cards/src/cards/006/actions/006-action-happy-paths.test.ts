import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  dinglehopper,
  dragonFire,
  healingGlow,
  merlinSelfappointedMentor,
  mickeyMouseTrueFriend,
  mickeyMouseWaywardSorcerer,
  simbaProtectiveCub,
} from "../../001";
import {
  baymaxPersonalHealthcareCompanion,
  daisyDuckPirateCaptain,
  gadgetHackwrenchPerceptiveMouse,
  madamMimTinyAdversary,
} from "../characters";
import { owlIslandSecludedEntrance } from "../locations";
import { goodJob } from "./027-good-job";
import { rescueRangersAway } from "./029-rescue-rangers-away";
import { safeAndSound } from "./030-safe-and-sound";
import { aVeryMerryUnbirthday } from "./060-a-very-merry-unbirthday";
import { makingMagic } from "./062-making-magic";
import { seekingTheHalfCrown } from "./064-seeking-the-half-crown";
import { bendToMyWill } from "./093-bend-to-my-will";
import { prepareToBoard } from "./094-prepare-to-board";
import { mosquitoBite } from "./096-mosquito-bite";
import { youCameBack } from "./097-you-came-back";
import { thievery } from "./128-thievery";
import { leadTheWay } from "./129-lead-the-way";
import { theIslandsIPulledFromTheSea } from "./130-the-islands-i-pulled-from-the-sea";
import { energyBlast } from "./131-energy-blast";
import { weCouldBeImmortals } from "./162-we-could-be-immortals";
import { helpingHand } from "./164-helping-hand";
import { prepareYourBot } from "./165-prepare-your-bot";
import { hotPotato } from "./195-hot-potato";
import { imStillHere } from "./196-im-still-here";
import { ambush } from "./198-ambush";
import { youCameBackEnchanted } from "./213-you-came-back-enchanted";
import { theIslandsIPulledFromTheSeaEnchanted } from "./216-the-islands-i-pulled-from-the-sea-enchanted";
import { weCouldBeImmortalsEnchanted } from "./219-we-could-be-immortals-enchanted";

describe("set 006 action happy paths", () => {
  it("Good Job gives the chosen character +1 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goodJob],
      inkwell: goodJob.cost,
      play: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(goodJob, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardLore(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.lore + 1,
    );
  });

  it("Rescue Rangers Away reduces strength by the number of your characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rescueRangersAway],
        inkwell: rescueRangersAway.cost,
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
      {
        play: [gadgetHackwrenchPerceptiveMouse],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(rescueRangersAway, gadgetHackwrenchPerceptiveMouse),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(gadgetHackwrenchPerceptiveMouse)).toBe(
      gadgetHackwrenchPerceptiveMouse.strength - 2,
    );
  });

  it("Safe and Sound stops your chosen character from being challenged during the opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [safeAndSound],
        inkwell: safeAndSound.cost,
        play: [simbaProtectiveCub],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(safeAndSound, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().canChallenge(mickeyMouseTrueFriend, simbaProtectiveCub)).toBe(
      false,
    );
  });

  it("A Very Merry Unbirthday mills the top 2 cards of each opponent deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aVeryMerryUnbirthday],
        inkwell: aVeryMerryUnbirthday.cost,
      },
      {
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend, healingGlow],
      },
    );

    expect(testEngine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(1);
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(2);
  });

  it("Making Magic moves damage and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makingMagic],
        inkwell: makingMagic.cost,
        deck: [healingGlow],
        play: [{ card: simbaProtectiveCub, damage: 1 }],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(makingMagic, {
        targets: [simbaProtectiveCub, mickeyMouseTrueFriend],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("Seeking the Half Crown is discounted by your Sorcerers and draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [seekingTheHalfCrown],
      inkwell: 3,
      deck: [healingGlow, dragonFire],
      play: [mickeyMouseWaywardSorcerer, merlinSelfappointedMentor],
    });

    expect(testEngine.asPlayerOne().canPlayCard(seekingTheHalfCrown)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(seekingTheHalfCrown)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("Bend to My Will makes each opponent discard all cards in their hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bendToMyWill],
        inkwell: bendToMyWill.cost,
      },
      {
        hand: [healingGlow, dragonFire],
      },
    );

    expect(testEngine.asPlayerOne().playCard(bendToMyWill)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 0, discard: 2 });
  });

  it("Prepare to Board gives a Pirate +3 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [prepareToBoard],
      inkwell: prepareToBoard.cost,
      play: [daisyDuckPirateCaptain],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(prepareToBoard, daisyDuckPirateCaptain),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(daisyDuckPirateCaptain)).toBe(
      daisyDuckPirateCaptain.strength + 3,
    );
  });

  it("Mosquito Bite puts 1 damage on the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mosquitoBite],
        inkwell: mosquitoBite.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(mosquitoBite, mickeyMouseTrueFriend),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(1);
  });

  it("You Came Back readies the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youCameBack],
      inkwell: youCameBack.cost,
      play: [{ card: simbaProtectiveCub, exerted: true }],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(youCameBack, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toBeReady(simbaProtectiveCub);
  });

  it("Thievery makes the opponent lose 1 lore and gains 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [thievery],
      inkwell: thievery.cost,
    });

    expect(testEngine.asPlayerOne().playCard(thievery)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
  });

  it("Lead the Way gives your characters +2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [leadTheWay],
      inkwell: leadTheWay.cost,
      play: [simbaProtectiveCub, mickeyMouseTrueFriend],
    });

    expect(testEngine.asPlayerOne().playCard(leadTheWay)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.strength + 2,
    );
    expect(testEngine.asPlayerOne().getCardStrength(mickeyMouseTrueFriend)).toBe(
      mickeyMouseTrueFriend.strength + 2,
    );
  });

  it("The Islands I Pulled from the Sea reveals a searched location and puts it into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theIslandsIPulledFromTheSea],
      inkwell: theIslandsIPulledFromTheSea.cost,
      deck: [owlIslandSecludedEntrance],
    });
    const locationId = testEngine.findCardInstanceId(owlIslandSecludedEntrance, "deck", PLAYER_ONE);

    expect(testEngine.asPlayerOne().playCard(theIslandsIPulledFromTheSea)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(owlIslandSecludedEntrance)).toBe("hand");
    const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    expect(cardMeta[locationId]?.revealed).toBe(true);
  });

  it("Energy Blast banishes the chosen character and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [energyBlast],
        inkwell: energyBlast.cost,
        deck: [healingGlow],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(energyBlast, mickeyMouseTrueFriend),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("We Could Be Immortals gives only your Inventors Resist +6 and puts itself into your inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weCouldBeImmortals],
      inkwell: weCouldBeImmortals.cost,
      play: [gadgetHackwrenchPerceptiveMouse, simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(weCouldBeImmortals)).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(gadgetHackwrenchPerceptiveMouse, "Resist")).toBe(6);
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBeNull();
    expect(testEngine.asPlayerOne().getCardZone(weCouldBeImmortals)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(weCouldBeImmortals)).toBe(true);
  });

  it("Helping Hand gives Support this turn and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [helpingHand],
      inkwell: helpingHand.cost,
      deck: [healingGlow],
      play: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(helpingHand, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(simbaProtectiveCub)?.hasSupport).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("Prepare Your Bot readies the chosen Robot and stops it from questing this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [prepareYourBot],
      inkwell: prepareYourBot.cost,
      play: [baymaxPersonalHealthcareCompanion],
    });

    expect(
      testEngine.asServer().manualExertCard(baymaxPersonalHealthcareCompanion),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(prepareYourBot, {
        choiceIndex: 1,
        targets: [baymaxPersonalHealthcareCompanion],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne()).toBeReady(baymaxPersonalHealthcareCompanion);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: baymaxPersonalHealthcareCompanion,
      restriction: "cant-quest",
    });
  });

  it("Hot Potato can banish the chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hotPotato],
        inkwell: hotPotato.cost,
      },
      {
        play: [dinglehopper],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(hotPotato, {
        choiceIndex: 1,
        targets: [dinglehopper],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("discard");
  });

  it("I'm Still Here gives Resist +2 through the opponent's turn and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [imStillHere],
        inkwell: imStillHere.cost,
        deck: [healingGlow, dragonFire],
        play: [simbaProtectiveCub],
      },
      {
        deck: [dragonFire],
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(imStillHere, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(2);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(2);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(2);
  });

  it("Ambush exerts one of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ambush],
        inkwell: ambush.cost,
        play: [simbaProtectiveCub],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_ONE);
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(ambush, {
        targets: [simbaId, mickeyId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().isExerted(simbaId)).toBe(true);
  });
});

describe("set 006 enchanted action parity", () => {
  it("matches You Came Back enchanted parity", () => {
    expect(youCameBackEnchanted.canonicalId).toBe(youCameBack.canonicalId);
    expect(youCameBackEnchanted.missingImplementation).toBe(youCameBack.missingImplementation);
    expect(youCameBackEnchanted.missingTests).toBe(youCameBack.missingTests);
    expect(youCameBackEnchanted.abilities).toEqual(youCameBack.abilities);
  });

  it("matches The Islands I Pulled from the Sea enchanted parity", () => {
    expect(theIslandsIPulledFromTheSeaEnchanted.canonicalId).toBe(
      theIslandsIPulledFromTheSea.canonicalId,
    );
    expect(theIslandsIPulledFromTheSeaEnchanted.missingImplementation).toBe(
      theIslandsIPulledFromTheSea.missingImplementation,
    );
    expect(theIslandsIPulledFromTheSeaEnchanted.missingTests).toBe(
      theIslandsIPulledFromTheSea.missingTests,
    );
    expect(theIslandsIPulledFromTheSeaEnchanted.abilities).toEqual(
      theIslandsIPulledFromTheSea.abilities,
    );
  });

  it("matches We Could Be Immortals enchanted parity", () => {
    expect(weCouldBeImmortalsEnchanted.canonicalId).toBe(weCouldBeImmortals.canonicalId);
    expect(weCouldBeImmortalsEnchanted.missingImplementation).toBe(
      weCouldBeImmortals.missingImplementation,
    );
    expect(weCouldBeImmortalsEnchanted.missingTests).toBe(weCouldBeImmortals.missingTests);
    expect(weCouldBeImmortalsEnchanted.abilities).toEqual(weCouldBeImmortals.abilities);
  });
});
