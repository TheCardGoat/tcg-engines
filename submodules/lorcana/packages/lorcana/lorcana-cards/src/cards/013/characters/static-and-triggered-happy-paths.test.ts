import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { winnieThePoohPigletHunnyMages } from "./062-winnie-the-pooh-piglet-hunny-mages";
import { grandmaWuWiseGrandmother } from "./053-grandma-wu-wise-grandmother";
import { russellJuniorWildernessExplorer } from "./082-russell-junior-wilderness-explorer";
import { madamMimHummingbird } from "./086-madam-mim-hummingbird";
import { poseyVampirePotato } from "./091-posey-vampire-potato";
import { todCleverFox } from "./081-tod-clever-fox";
import { dashParrSuperFast } from "./109-dash-parr-super-fast";
import { lumpyHunnyDruid } from "./042-lumpy-hunny-druid";
import { heiheiCreatedByTheVine } from "./054-heihei-created-by-the-vine";
import { theBearTerritorialAnimal } from "./112-the-bear-territorial-animal";
import { grandmaWuFierceRedPanda } from "./120-grandma-wu-fierce-red-panda";
import { dugGoodBoy } from "./144-dug-good-boy";
import { rozAlwaysWatching } from "./145-roz-always-watching";
import { quackerjackLoonyToymaker } from "./147-quackerjack-loony-toymaker";
import { alphaPackLeader } from "./151-alpha-pack-leader";
import { sulleyStrategicScarer } from "./152-sulley-strategic-scarer";
import { henryJWaternooseIiiChiefExecutiveOfficer } from "./163-henry-j-waternoose-iii-chief-executive-officer";
import { eeyoreHunnyScholar } from "./164-eeyore-hunny-scholar";
import { violetParrSuperResilient } from "./176-violet-parr-super-resilient";
import { aladdinCreatedByTheVine } from "./177-aladdin-created-by-the-vine";
import { dashParrVioletParrSuperSiblings } from "./133-dash-parr-violet-parr-super-siblings";
import { diabloProtectingHisMistress } from "./193-diablo-protecting-his-mistress";
import { ellieFredricksenAdventurePartner } from "./149-ellie-fredricksen-adventure-partner";
import { scarCreatedByTheVine } from "./194-scar-created-by-the-vine";
import { yzmaChoosyCustomer } from "./110-yzma-choosy-customer";
import { kronkMeatHutCook } from "./191-kronk-meat-hut-cook";
import { potato } from "../items/105-potato";

const itemInPlay = createMockItem({
  id: "dug-good-boy-test-item",
  name: "Test Item",
  cost: 1,
});

const deckCard = createMockCharacter({
  id: "dug-good-boy-deck-card",
  name: "Deck Card",
  cost: 1,
});

const maleficentAlly = createMockCharacter({
  id: "diablo-test-maleficent",
  name: "Maleficent",
  cost: 3,
});

const nonInkableHandCard = createMockCharacter({
  id: "madam-mim-hummingbird-non-inkable-card",
  name: "Non Inkable Hand Card",
  cost: 2,
});

Object.assign(nonInkableHandCard, { inkable: false });

const kronkDrawnCard = createMockCharacter({
  id: "kronk-meat-hut-cook-drawn-card",
  name: "Kronk Drawn Card",
  cost: 1,
});

const kronkDiscardCard = createMockCharacter({
  id: "kronk-meat-hut-cook-discard-card",
  name: "Kronk Discard Card",
  cost: 1,
});

const floodbornAttacker = createMockCharacter({
  id: "scar-created-by-the-vine-floodborn-attacker",
  name: "Floodborn Attacker",
  cost: 3,
  strength: 5,
  willpower: 4,
  classifications: ["Floodborn", "Hero"],
});

const scarChallengeDefender = createMockCharacter({
  id: "scar-created-by-the-vine-defender",
  name: "Scar Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const scarDrawCard = createMockCharacter({
  id: "scar-created-by-the-vine-draw-card",
  name: "Scar Draw Card",
  cost: 1,
});

const todDrawA = createMockCharacter({
  id: "tod-clever-fox-draw-a",
  name: "Tod Draw A",
  cost: 1,
});

const todDrawB = createMockCharacter({
  id: "tod-clever-fox-draw-b",
  name: "Tod Draw B",
  cost: 1,
});

const todDiscardCard = createMockCharacter({
  id: "tod-clever-fox-discard-card",
  name: "Tod Discard Card",
  cost: 1,
});

const aladdinDrawCard = createMockCharacter({
  id: "aladdin-vine-draw-card",
  name: "Aladdin Draw Card",
  cost: 1,
});

const aladdinDiscardCard = createMockCharacter({
  id: "aladdin-vine-discard-card",
  name: "Aladdin Discard Card",
  cost: 1,
});

const alphaPlayedItem = createMockItem({
  id: "alpha-pack-leader-played-item",
  name: "Alpha Played Item",
  cost: 1,
});

const alphaBuffTarget = createMockCharacter({
  id: "alpha-pack-leader-buff-target",
  name: "Alpha Buff Target",
  cost: 1,
  strength: 1,
});

const damagedMoveSource = createMockCharacter({
  id: "set13-move-damage-source",
  name: "Move Damage Source",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const moveDamageDestination = createMockCharacter({
  id: "set13-move-damage-destination",
  name: "Move Damage Destination",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const ellieBanishAttacker = createMockCharacter({
  id: "ellie-adventure-partner-banish-attacker",
  name: "Ellie Banish Attacker",
  cost: 3,
  strength: 5,
  willpower: 4,
});

const dashVioletUnderA = createMockCharacter({
  id: "dash-violet-under-a",
  name: "Dash Violet Under A",
  cost: 1,
});

const dashVioletUnderB = createMockCharacter({
  id: "dash-violet-under-b",
  name: "Dash Violet Under B",
  cost: 1,
});

const dashVioletDrawA = createMockCharacter({
  id: "dash-violet-draw-a",
  name: "Dash Violet Draw A",
  cost: 1,
});

const dashVioletDrawB = createMockCharacter({
  id: "dash-violet-draw-b",
  name: "Dash Violet Draw B",
  cost: 1,
});

const dashVioletChallengeTarget = createMockCharacter({
  id: "dash-violet-challenge-target",
  name: "Dash Violet Challenge Target",
  cost: 2,
  strength: 1,
  willpower: 5,
});

const magicalMixRuby = createMockCharacter({
  id: "hunny-mages-ruby-character",
  name: "Hunny Mages Ruby Character",
  cost: 1,
  inkType: ["ruby"],
});

const magicalMixSteelSapphire = createMockCharacter({
  id: "hunny-mages-steel-sapphire-character",
  name: "Hunny Mages Steel Sapphire Character",
  cost: 1,
  inkType: ["steel", "sapphire"],
});

const shiftedGrandmaWu = createMockCharacter({
  id: "grandma-wu-wise-shifted",
  name: "Grandma Wu",
  cost: 4,
  abilities: [
    {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
      shiftTarget: "Grandma Wu",
    },
  ],
});

const russellTravelBuddy = createMockCharacter({
  id: "russell-travel-buddy",
  name: "Russell Travel Buddy",
  cost: 1,
});

const russellLocation = createMockLocation({
  id: "russell-location",
  name: "Russell Location",
  cost: 1,
  moveCost: 2,
});

const dashSuperFastTopDeck = createMockCharacter({
  id: "dash-super-fast-top-deck",
  name: "Dash Super Fast Top Deck",
  cost: 1,
});

const grandmaWuChallengeTarget = createMockCharacter({
  id: "grandma-wu-fierce-target",
  name: "Grandma Wu Fierce Target",
  cost: 1,
  strength: 1,
  willpower: 6,
});

const quackerjackItemA = createMockItem({
  id: "quackerjack-item-a",
  name: "Quackerjack Item A",
  cost: 1,
});

const quackerjackItemB = createMockItem({
  id: "quackerjack-item-b",
  name: "Quackerjack Item B",
  cost: 1,
});

const quackerjackNonItem = createMockCharacter({
  id: "quackerjack-non-item",
  name: "Quackerjack Non Item",
  cost: 1,
});

const quackerjackTarget = createMockCharacter({
  id: "quackerjack-target",
  name: "Quackerjack Target",
  cost: 1,
  willpower: 5,
});

const eeyoreHunnyTarget = createMockCharacter({
  id: "eeyore-hunny-target",
  name: "Eeyore Hunny Target",
  cost: 1,
  lore: 1,
  classifications: ["Storyborn", "Hunny"],
});

const violetHero = createMockCharacter({
  id: "violet-super-resilient-hero",
  name: "Violet Hero",
  cost: 1,
  classifications: ["Storyborn", "Hero"],
});

const violetDrawCard = createMockCharacter({
  id: "violet-super-resilient-draw",
  name: "Violet Draw Card",
  cost: 1,
});

const violetDiscardCard = createMockCharacter({
  id: "violet-super-resilient-discard",
  name: "Violet Discard Card",
  cost: 1,
});

describe("Set 13 static and triggered happy paths", () => {
  it("Yzma - Choosy Customer makes each opponent lose 1 lore when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [yzmaChoosyCustomer],
        inkwell: yzmaChoosyCustomer.cost,
      },
      {
        lore: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(yzmaChoosyCustomer)).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects();

    expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
  });

  it("The Bear - Territorial Animal gets +3 strength while damaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: theBearTerritorialAnimal, damage: 1 }],
    });

    expect(testEngine.asPlayerOne().getCardStrength(theBearTerritorialAnimal)).toBe(5);
  });

  it("Dug - Good Boy draws a card when played with an item in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dugGoodBoy],
      play: [itemInPlay],
      deck: [deckCard],
      inkwell: dugGoodBoy.cost,
    });

    expect(testEngine.asPlayerOne().playCard(dugGoodBoy)).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects();

    expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("hand");
  });

  it("Sulley - Strategic Scarer gets +2 strength while you have 5 or more cards in your inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sulleyStrategicScarer],
      inkwell: 5,
    });

    expect(testEngine.asPlayerOne().getCardStrength(sulleyStrategicScarer)).toBe(6);
  });

  it("Diablo - Protecting His Mistress gives your Maleficent characters Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [diabloProtectingHisMistress, maleficentAlly],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(maleficentAlly, "Resist")).toBe(1);
  });

  it("Madam Mim - Hummingbird lets all cards in your hand count as inkable", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [madamMimHummingbird],
      hand: [nonInkableHandCard],
    });

    expect(testEngine.asPlayerOne().ink(nonInkableHandCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(nonInkableHandCard)).toBe("inkwell");
  });

  it("Kronk - Meat Hut Cook draws a card, then discards a chosen card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [kronkMeatHutCook],
      hand: [kronkDiscardCard],
      deck: [kronkDrawnCard],
      inkwell: 1,
    });

    expect(testEngine.asPlayerOne().activateAbility(kronkMeatHutCook)).toBeSuccessfulCommand();
    const discardCardId = testEngine.findCardInstanceId(kronkDiscardCard, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardCardId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(kronkDrawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(kronkDiscardCard)).toBe("discard");
  });

  it("Scar - Created by the Vine gains lore when your Floodborn banishes in a challenge on your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [scarCreatedByTheVine, floodbornAttacker],
      },
      {
        play: [{ card: scarChallengeDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(floodbornAttacker, scarChallengeDefender),
    ).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects();

    expect(testEngine.getLore("player_one")).toBe(1);
  });

  it("Scar - Created by the Vine draws when your Floodborn is banished during an opponent's turn", () => {
    const opposingAttacker = createMockCharacter({
      id: "scar-created-by-the-vine-opposing-attacker",
      name: "Opposing Attacker",
      cost: 3,
      strength: 5,
      willpower: 4,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [scarCreatedByTheVine, { card: floodbornAttacker, exerted: true }],
        deck: [scarDrawCard],
      },
      {
        play: [opposingAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, floodbornAttacker),
    ).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects();

    expect(testEngine.asPlayerOne().getCardZone(scarDrawCard)).toBe("hand");
  });

  it("Tod - Clever Fox draws 2 cards, then discards a chosen card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [todCleverFox, todDiscardCard],
      deck: [todDrawA, todDrawB],
      inkwell: todCleverFox.cost,
    });

    expect(testEngine.asPlayerOne().playCard(todCleverFox)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(todCleverFox)).toBeSuccessfulCommand();
    const discardCardId = testEngine.findCardInstanceId(todDiscardCard, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardCardId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(todDrawA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(todDrawB)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(todDiscardCard)).toBe("discard");
  });

  it("Aladdin - Created by the Vine may draw and discard when your Floodborn quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [aladdinCreatedByTheVine],
      hand: [aladdinDiscardCard],
      deck: [aladdinDrawCard],
    });

    expect(testEngine.asPlayerOne().quest(aladdinCreatedByTheVine)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(aladdinCreatedByTheVine, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    const discardCardId = testEngine.findCardInstanceId(aladdinDiscardCard, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardCardId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(aladdinDrawCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(aladdinDiscardCard)).toBe("discard");
  });

  it("Alpha - Pack Leader buffs a chosen character when you play an item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [alphaPackLeader, alphaBuffTarget],
      hand: [alphaPlayedItem],
      inkwell: alphaPlayedItem.cost,
    });

    expect(testEngine.asPlayerOne().playCard(alphaPlayedItem)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(alphaPackLeader, {
        targets: [alphaBuffTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(alphaBuffTarget)).toBe(2);
    expect(testEngine.asPlayerOne().getKeywordValue(alphaBuffTarget, "Resist")).toBe(1);
  });

  it("Lumpy - Hunny Druid may move up to 2 damage when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lumpyHunnyDruid],
        inkwell: lumpyHunnyDruid.cost,
        play: [{ card: damagedMoveSource, damage: 3 }],
      },
      {
        play: [moveDamageDestination],
      },
    );

    expect(testEngine.asPlayerOne().playCard(lumpyHunnyDruid)).toBeSuccessfulCommand();
    const fromId = testEngine.findCardInstanceId(damagedMoveSource, "play", "player_one");
    const toId = testEngine.findCardInstanceId(moveDamageDestination, "play", "player_two");
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(lumpyHunnyDruid, {
        resolveOptional: true,
        targets: { kind: "move-damage", from: [fromId], to: [toId] } as never,
        amount: 2,
      } as never),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedMoveSource)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(moveDamageDestination)).toBe(2);
  });

  it("Heihei - Created by the Vine may move 1 damage when your Floodborn quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [heiheiCreatedByTheVine, { card: damagedMoveSource, damage: 2 }],
      },
      {
        play: [moveDamageDestination],
      },
    );

    expect(testEngine.asPlayerOne().quest(heiheiCreatedByTheVine)).toBeSuccessfulCommand();
    const fromId = testEngine.findCardInstanceId(damagedMoveSource, "play", "player_one");
    const toId = testEngine.findCardInstanceId(moveDamageDestination, "play", "player_two");
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(heiheiCreatedByTheVine, {
        resolveOptional: true,
        targets: { kind: "move-damage", from: [fromId], to: [toId] } as never,
      } as never),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedMoveSource)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(moveDamageDestination)).toBe(1);
  });

  it("Ellie Fredricksen - Adventure Partner may go to inkwell when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: ellieFredricksenAdventurePartner, exerted: true }],
      },
      {
        play: [ellieBanishAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(ellieBanishAttacker, ellieFredricksenAdventurePartner),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ellieFredricksenAdventurePartner, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ellieFredricksenAdventurePartner)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(ellieFredricksenAdventurePartner)).toBe(true);
  });

  it("Dash Parr & Violet Parr - Super Siblings draws for each card under them when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        {
          card: dashParrVioletParrSuperSiblings,
          cardsUnder: [dashVioletUnderA, dashVioletUnderB],
        },
      ],
      deck: [dashVioletDrawA, dashVioletDrawB],
    });

    expect(testEngine.asPlayerOne().quest(dashParrVioletParrSuperSiblings)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(dashVioletDrawA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(dashVioletDrawB)).toBe("hand");
  });

  it("Dash Parr & Violet Parr - Super Siblings draws for each card under them when challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          {
            card: dashParrVioletParrSuperSiblings,
            isDrying: false,
            cardsUnder: [dashVioletUnderA],
          },
        ],
        deck: [dashVioletDrawA],
      },
      {
        play: [{ card: dashVioletChallengeTarget, exerted: true }],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .challenge(dashParrVioletParrSuperSiblings, dashVioletChallengeTarget),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(dashVioletDrawA)).toBe("hand");
  });

  it("Winnie the Pooh & Piglet - Hunny Mages gets lore for each different friendly character ink type", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [winnieThePoohPigletHunnyMages, magicalMixRuby, magicalMixSteelSapphire],
    });

    expect(testEngine.asPlayerOne().getCardLore(winnieThePoohPigletHunnyMages)).toBe(4);
  });

  it("Grandma Wu - Wise Grandmother gains 1 lore when a character is shifted on top of her", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [grandmaWuWiseGrandmother],
      hand: [shiftedGrandmaWu],
      inkwell: 2,
    });

    const shiftTarget = testEngine.findCardInstanceId(grandmaWuWiseGrandmother, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(shiftedGrandmaWu, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("Russell - Junior Wilderness Explorer may move himself and another character to the same location when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: russellJuniorWildernessExplorer, isDrying: false },
        russellTravelBuddy,
        russellLocation,
      ],
    });

    expect(testEngine.asPlayerOne().quest(russellJuniorWildernessExplorer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(russellJuniorWildernessExplorer, {
        resolveOptional: true,
        targets: {
          kind: "move-to-location",
          subject: [testEngine.findCardInstanceId(russellTravelBuddy, "play", PLAYER_ONE)],
          location: [testEngine.findCardInstanceId(russellLocation, "play", PLAYER_ONE)],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: russellJuniorWildernessExplorer,
      location: russellLocation,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: russellTravelBuddy,
      location: russellLocation,
    });
  });

  it("Posey - Vampire Potato can shift onto an item named Potato", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [potato],
      hand: [poseyVampirePotato],
      inkwell: 5,
    });

    const shiftTarget = testEngine.findCardInstanceId(potato, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(poseyVampirePotato, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(poseyVampirePotato)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveCardsUnder({
      card: poseyVampirePotato,
      count: 1,
    });
  });

  it("Dash Parr - Super Fast may play the revealed top card when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: dashParrSuperFast, isDrying: false }],
      deck: [dashSuperFastTopDeck],
      inkwell: dashSuperFastTopDeck.cost,
    });

    expect(testEngine.asPlayerOne().quest(dashParrSuperFast)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(dashParrSuperFast, {
        resolveOptional: true,
        choiceIndex: 0,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(dashSuperFastTopDeck)).toBe("play");
  });

  it("Grandma Wu - Fierce Red Panda gains lore and makes the opponent lose lore when challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: grandmaWuFierceRedPanda, isDrying: false }],
      },
      {
        play: [{ card: grandmaWuChallengeTarget, exerted: true }],
        lore: 3,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(grandmaWuFierceRedPanda, grandmaWuChallengeTarget),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
  });

  it("Roz - Always Watching defines opponent top-deck visibility", () => {
    expect(rozAlwaysWatching.abilities?.[0]).toMatchObject({
      type: "static",
      name: "ALWAYS",
      effect: {
        type: "reveal-top-card",
        target: "OPPONENTS",
      },
    });
  });

  it("Quackerjack - Loony Toymaker deals damage equal to item cards milled", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [quackerjackLoonyToymaker],
        deck: [quackerjackItemA, quackerjackNonItem, quackerjackItemB, dashVioletUnderA],
        inkwell: quackerjackLoonyToymaker.cost,
      },
      {
        play: [quackerjackTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(quackerjackLoonyToymaker)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(quackerjackLoonyToymaker, {
        resolveOptional: true,
        targets: [quackerjackTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(quackerjackTarget)).toBe(2);
  });

  it("Henry J. Waternoose III gets +2 lore and Ward while ahead on inkwell cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [henryJWaternooseIiiChiefExecutiveOfficer],
        inkwell: 3,
      },
      {
        inkwell: 2,
      },
    );

    expect(testEngine.asPlayerOne().getCardLore(henryJWaternooseIiiChiefExecutiveOfficer)).toBe(4);
    expect(
      testEngine.asPlayerOne().hasKeyword(henryJWaternooseIiiChiefExecutiveOfficer, "Ward"),
    ).toBe(true);
  });

  it("Eeyore - Hunny Scholar gives a chosen Hunny +1 lore and Ward when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: eeyoreHunnyScholar, isDrying: false }, eeyoreHunnyTarget],
    });

    expect(testEngine.asPlayerOne().quest(eeyoreHunnyScholar)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(eeyoreHunnyScholar, {
        targets: [eeyoreHunnyTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(eeyoreHunnyTarget)).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(eeyoreHunnyTarget, "Ward")).toBe(true);
  });

  it("Violet Parr - Super Resilient may draw and discard when you play another Hero", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [violetParrSuperResilient],
      hand: [violetHero, violetDiscardCard],
      deck: [violetDrawCard],
      inkwell: violetHero.cost,
    });

    expect(testEngine.asPlayerOne().playCard(violetHero)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        targets: [violetDiscardCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(violetDrawCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(violetDiscardCard)).toBe("discard");
  });
});
