import type {
  CardEffectTarget,
  LorcanitoActionCard,
  ResolutionAbility,
  TargetCardEffect,
} from "@lorcanito/lorcana-engine";
import { foodFightAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  chosenCharacter,
  chosenCharacterItemOrLocation,
  opposingCharactersWithEvasive,
  opposingCharactersWithoutEvasive,
} from "@lorcanito/lorcana-engine/abilities/target";
import {
  allYourCharacters,
  anyCard,
  anyNumberOfChosenCharacters,
  chosenCharacterOfYours,
  self,
  targetCard,
  thisCard,
  thisCharacter,
  topCardOfYourDeck,
  yourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import {
  banishChosenCharacterOfYours,
  banishChosenOpposingCharacter,
  choseCharacterGainsReckless,
  chosenCharacterCantChallengeDuringNextTurn,
  chosenCharacterGainsEvasive,
  chosenCharacterGainsRecklessDuringNextTurn,
  chosenCharacterGainsResist,
  chosenCharacterGainsRush,
  chosenCharacterOfYoursGainsChallengerX,
  chosenCharacterOfYoursGainsWhenBanishedReturnToHand,
  dealDamageEffect,
  drawACard,
  drawCardsUntilYouHaveSameNumberOfCardsAsOpponent,
  drawXCards,
  putCardFromYourHandOnTheTopOfYourDeck,
  readyAndCantQuest,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import type {
  RevealTopCardEffect,
  ShuffleEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";

export const tryEverything: LorcanitoActionCard = {
  id: "vjj",
  missingTestCase: true,
  name: "Try Everything",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n<br>Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: chosenCharacter,
        },
        ...readyAndCantQuest(chosenCharacter),
      ],
    },
  ],
  flavour: "I want to try even though I could fail",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Nicolas Ky",
  number: 25,
  set: "SSK",
  rarity: "uncommon",
};
export const healingTouch: LorcanitoActionCard = {
  id: "i7a",
  missingTestCase: true,
  name: "Healing Touch",
  characteristics: ["action"],
  text: "Remove up to 4 damage from chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: chosenCharacter,
        },
        drawACard,
      ],
    },
  ],
  flavour:
    "The heart is not so easily changed, but the head can be persuaded.\n—Grand Pabbie",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 26,
  set: "SSK",
  rarity: "common",
};
export const revive: LorcanitoActionCard = {
  id: "xie",
  missingTestCase: true,
  name: "Revive",
  characteristics: ["action"],
  text: "Play a character card with cost 5 or less from your discard for free.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "discard" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Not all that is lost is gone forever.",
  colors: ["amber"],
  cost: 5,
  illustrator: "Jared Matthews",
  number: 27,
  set: "SSK",
  rarity: "rare",
};
export const blastFromYourPast: LorcanitoActionCard = {
  id: "zt6",
  name: "Blast From Your Past",
  characteristics: ["action", "song"],
  text: "_(A character with cost 6 or more can {E} to sing this song for free.)_\nName a card. Return all character cards with that name from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      nameACard: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "discard" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              {
                filter: "name-a-card",
              },
            ],
          },
        },
      ],
    },
  ],
  colors: ["amber"],
  cost: 6,
  illustrator: "Nicola Saviori",
  number: 28,
  set: "SSK",
  rarity: "super_rare",
};
export const invitedToTheBallAction: LorcanitoActionCard = {
  id: "lnv",
  missingTestCase: true,
  name: "Invited to the Ball",
  characteristics: ["action"],
  text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "scry",
          amount: 2,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 2,
            inkwell: 0,
            top: 0,
            hand: 2,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "type", value: "character" },
          ],
        },
      ],
    },
  ],
  colors: ["amber"],
  cost: 2,
  illustrator: "Taraneh",
  number: 29,
  set: "SSK",
  rarity: "uncommon",
};
export const hypnoticStrength: LorcanitoActionCard = {
  id: "ron",
  missingTestCase: true,
  name: "Hypnotic Strength",
  characteristics: ["action"],
  text: "Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Draw a card. ",
      effects: [drawACard],
    },
    {
      type: "resolution",
      text: "Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Suddenly, Basil felt a strong desire to find the broken crown.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Giulia Riva",
  number: 59,
  set: "SSK",
  rarity: "common",
};
export const findersKeepers: LorcanitoActionCard = {
  id: "ko3",
  missingTestCase: true,
  name: "Finders Keepers",
  characteristics: ["action"],
  text: "Draw 3 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Draw 3 cards.",
      effects: [
        {
          type: "draw",
          amount: 3,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    },
  ],
  flavour: '"Three wishes, comin\' right up!" \n— Iago',
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  illustrator: "Andy Estrada / Stefano Zanchi",
  number: 60,
  set: "SSK",
  rarity: "uncommon",
};

const targetWithSameName: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "owner", value: "self" },
    {
      filter: "top-deck",
      value: "self",
    },
    {
      filter: "attribute",
      value: "name",
      comparison: { operator: "eq", value: "target" },
    },
  ],
};

const revealTopCardAndPlay: RevealTopCardEffect = {
  type: "reveal-top-card",
  target: targetWithSameName,
  useParentsTarget: true,
  asOptionalLayer: true,
  onTargetMatchEffects: [
    {
      type: "play",
      forFree: true,
      target: targetWithSameName,
    },
  ],
  onTargetMatchFailureEffects: [
    {
      type: "move",
      to: "hand",
      target: topCardOfYourDeck,
    },
  ],
};

const shuffleFromDiscard: ShuffleEffect = {
  type: "shuffle",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "discard" },
    ],
  },
  afterEffect: [
    {
      type: "create-layer-based-on-target",
      target: thisCharacter,
      effects: [revealTopCardAndPlay],
    },
  ],
};

const weKnowTheWayAbility: ResolutionAbility = {
  type: "resolution",
  text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
  effects: [shuffleFromDiscard],
};

export const weKnowTheWay: LorcanitoActionCard = {
  id: "tc8",
  name: "We Know The Way",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can  {E} to sing this song for free.)_ Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
  type: "action",
  abilities: [weKnowTheWayAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Jake Murphy",
  number: 61,
  set: "SSK",
  rarity: "rare",
};

export const gatheringKnowledgeAndWisdom: LorcanitoActionCard = {
  id: "uuj",
  missingTestCase: true,
  name: "Gathering Knowledge And Wisdom",
  characteristics: ["action"],
  text: "Gain 2 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Gain 2 lore.",
      effects: [
        {
          type: "lore",
          amount: 2,
          modifier: "add",
          target: self,
        },
      ],
    },
  ],
  flavour:
    "Just think! All this knowledge was under our noses the whole time. We only had to look in the right place.",
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Heidi Neunhoeffer",
  number: 62,
  set: "SSK",
  rarity: "common",
};
export const magicalAid: LorcanitoActionCard = {
  id: "sx8",
  name: "Magical Aid",
  characteristics: ["action"],
  text: "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Magical Aid",
      text: "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
      effects: [
        chosenCharacterOfYoursGainsChallengerX(3),
        chosenCharacterOfYoursGainsWhenBanishedReturnToHand,
      ],
    },
  ],
  flavour: "You’ve got some power in your corner now!\n— Genie",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Luca Pinelli",
  number: 63,
  set: "SSK",
  rarity: "uncommon",
};
export const hypnoticDeduction: LorcanitoActionCard = {
  id: "z2p",
  name: "Hypnotic Deduction",
  characteristics: ["action"],
  text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
  type: "action",
  abilities: [
    {
      name: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        putCardFromYourHandOnTheTopOfYourDeck,
        putCardFromYourHandOnTheTopOfYourDeck,
        drawXCards(3),
      ],
    },
  ],
  flavour:
    "A security device! Easily defeated, of course. Once I make room for the crown, I... can... bring... it... to... him.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Elodie Mondoloni",
  number: 94,
  set: "SSK",
  rarity: "common",
};
export const nightHowlerRage: LorcanitoActionCard = {
  id: "g2v",
  missingTestCase: true,
  name: "Night Howler Rage",
  characteristics: ["action"],
  text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can’t quest and must challenge if able.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can’t quest and must challenge if able.)_",
      effects: [chosenCharacterGainsRecklessDuringNextTurn, drawACard],
    },
  ],
  flavour:
    '"I think someone is targeting predators on purpose and making them go savage!" \n−Judy Hopps',
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Antoine Couttolenc",
  number: 95,
  set: "SSK",
  rarity: "common",
};
export const youreWelcome: LorcanitoActionCard = {
  id: "tri",
  name: "You're Welcome",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_<br>\nShuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  type: "action",
  abilities: [
    {
      name: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
      type: "resolution",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          // TODO: REVISIT THIS, this is hacky
          type: "from-target-card-to-target-player",
          player: "card-owner",
          target: chosenCharacterItemOrLocation,
          effects: [
            drawXCards(2),
            {
              type: "shuffle",
              target: chosenCharacterItemOrLocation,
            },
          ],
          // TODO: Fix this
        } as unknown as TargetCardEffect,
      ],
    },
  ],
  flavour: "I make everything happen!",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  illustrator: "César Vergara",
  number: 96,
  set: "SSK",
  rarity: "uncommon",
};
export const rememberWhoYouAre: LorcanitoActionCard = {
  id: "jps",
  missingTestCase: true,
  name: "Remember Who You Are",
  characteristics: ["action"],
  text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [drawCardsUntilYouHaveSameNumberOfCardsAsOpponent],
    },
  ],
  colors: ["emerald"],
  cost: 4,
  illustrator: "Cory Godbey",
  number: 97,
  set: "SSK",
  rarity: "rare",
};
export const breakFree: LorcanitoActionCard = {
  id: "qdj",
  missingTestCase: true,
  name: "Break Free",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they’re played.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they’re played.)_",
      effects: [
        {
          type: "damage",
          amount: 1,
          target: chosenCharacter,
        },
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
        chosenCharacterGainsRush,
      ],
    },
  ],
  flavour: "Tink darted from the shattered lantern in the blink of an eye.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Brian Kesinger",
  number: 127,
  set: "SSK",
  rarity: "common",
};
export const evilComesPrepared: LorcanitoActionCard = {
  id: "xc5",
  missingTestCase: true,
  name: "Evil Comes Prepared",
  characteristics: ["action"],
  text: "Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
      effects: readyAndCantQuest(chosenCharacterOfYours),
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  lore: 1,
  illustrator: "Adam Bunch",
  number: 128,
  set: "SSK",
  rarity: "common",
};
export const dontLetTheFrostbiteBite: LorcanitoActionCard = {
  id: "rdl",
  missingTestCase: true,
  name: "Don't Let the Frostbite Bite",
  characteristics: ["action", "song"],
  text: "_(A character with cost 7 or more can \n {E} to sing this song for free.)_<br>Ready all your characters. They can’t quest for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Ready all your characters. They can’t quest for the rest of this turn.",
      effects: readyAndCantQuest(allYourCharacters),
    },
  ],
  flavour: "Let’s call it a night",
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  illustrator: "Linh Dang",
  number: 129,
  set: "SSK",
  rarity: "rare",
};
export const glimmerVsGlimmer: LorcanitoActionCard = {
  id: "opx",
  missingTestCase: true,
  name: "Glimmer VS Glimmer",
  characteristics: ["action"],
  text: "Banish chosen character of yours to banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [banishChosenOpposingCharacter, banishChosenCharacterOfYours],
    },
  ],
  flavour:
    'Hades: "Listen, kid. If I’m gettin’ banished back to the lorebook, you’re going with me."\nHercules: "We’ll see about that."',
  colors: ["ruby"],
  cost: 4,
  illustrator: "Ian MacDonald",
  number: 130,
  set: "SSK",
  rarity: "uncommon",
};
export const whosWithMe: LorcanitoActionCard = {
  id: "hlq",
  missingTestCase: true,
  name: "Who's With Me?",
  characteristics: ["action"],
  text: "Your characters get +2 {S} this turn. \nWhenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: yourCharacters,
        },
      ],
    },
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          duration: "turn",
          modifier: "add",
          ability: "custom",
          customAbility: wheneverChallengesAnotherChar({
            name: "Who's With Me?",
            text: "Whenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
            effects: [youGainLore(2)],
          }),
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "ability", value: "reckless" },
            ],
          },
        },
      ],
    },
  ],
  flavour: '"Don\'t forget, the purple unicorn is mine!"',
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Denny Minonne",
  number: 131,
  set: "SSK",
  rarity: "super_rare",
};
export const visionOfTheFuture: LorcanitoActionCard = {
  id: "aks",
  missingTestCase: true,
  name: "Vision of the Future",
  characteristics: ["action"],
  text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 5,
          mode: "bottom",
          shouldRevealTutored: false,
          target: self,
          limits: {
            bottom: 4,
            inkwell: 0,
            hand: 1,
            top: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    },
  ],
  flavour:
    "We must repair the Illuminary before it’s too late. And we’ll need these devices, these chromicons, to fix it.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Leonardo Giammichele",
  number: 160,
  set: "SSK",
  rarity: "common",
};
export const royalTantrum: LorcanitoActionCard = {
  id: "v3q",
  name: "Royal Tantrum",
  characteristics: ["action"],
  text: "Banish any number of your items, then draw a card for each item banished this way.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "banish",
          forEach: [drawACard],
          target: {
            type: "card",
            value: 99,
            upTo: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "I am King! King! King!",
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Michela Cacciatore / Giulia Riva",
  number: 161,
  set: "SSK",
  rarity: "rare",
};
// TODO: implement "up to all" or "any number of targets"
export const everAsBefore: LorcanitoActionCard = {
  id: "nlq",
  missingTestCase: true,
  name: "Ever as Before",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_<br/>Remove up to 2 damage from any number of chosen characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: anyNumberOfChosenCharacters,
        },
      ],
    },
  ],
  flavour: "Ever just as sure\nAs the sun will rise",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Grace Tran",
  number: 162,
  set: "SSK",
  rarity: "common",
};
export const hideAway: LorcanitoActionCard = {
  id: "cyn",
  missingTestCase: true,
  name: "Hide Away",
  characteristics: ["action"],
  text: "Put chosen item or location into its player’s inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Put chosen item or location into its player’s inkwell facedown and exerted.",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["item", "location"] },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    'Fauna: "Oh my! We dropped some . . ."\nMerryweather: "You mean you dropped some!"',
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Mike Parker",
  number: 163,
  set: "SSK",
  rarity: "uncommon",
};
export const allFunnedOut: LorcanitoActionCard = {
  id: "q4i",
  missingTestCase: true,
  name: "All Funned Out",
  characteristics: ["action"],
  text: "Put chosen character of yours into your inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Put chosen character of yours into your inkwell facedown and exerted.",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacterOfYours,
        },
      ],
    },
  ],
  flavour: "Pretty pathetic, huh?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Adam Ford",
  number: 164,
  set: "SSK",
  rarity: "uncommon",
};
export const tugofwar: LorcanitoActionCard = {
  id: "r3r",
  missingTestCase: true,
  name: "Tug-of-War",
  characteristics: ["action"],
  text: "Choose one:<br>• Deal 1 damage to each opposing character without **Evasive**.<br>• Deal 3 damage to each opposing character with **Evasive**.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Deal 1 damage to each opposing character without **Evasive**.",
              effects: [dealDamageEffect(1, opposingCharactersWithoutEvasive)],
            },
            {
              id: "2",
              text: "Deal 3 damage to each opposing character with **Evasive**.",
              effects: [dealDamageEffect(3, opposingCharactersWithEvasive)],
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  illustrator: "Maxine Vee",
  number: 196,
  set: "SSK",
  rarity: "rare",
};
export const whenWillMyLifeBegin: LorcanitoActionCard = {
  id: "a04",
  name: "When Will My Life Begin?",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_<br>Chosen character can’t challenge during their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "When Will My Life Begin?",
      text: "Chosen character can’t challenge during their next turn. Draw a card.",
      effects: [drawACard, chosenCharacterCantChallengeDuringNextTurn],
    },
  ],
  flavour: "Stuck in the same place I’ve always been...",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Javi Salas",
  number: 197,
  set: "SSK",
  rarity: "common",
};
export const duckForCover: LorcanitoActionCard = {
  id: "jqo",
  missingTestCase: true,
  name: "Duck for Cover!",
  characteristics: ["action"],
  text: "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
      effects: [
        chosenCharacterGainsResist(1, "turn"),
        chosenCharacterGainsEvasive,
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Gianluca Barone",
  number: 198,
  set: "SSK",
  rarity: "common",
};
export const foodFight: LorcanitoActionCard = {
  id: "mwi",
  missingTestCase: true,
  name: "Food Fight!",
  characteristics: ["action"],
  text: "Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          duration: "turn",
          modifier: "add",
          ability: "custom",
          customAbility: foodFightAbility,
          target: yourCharacters,
        },
      ],
    },
  ],
  flavour: "Gawrsh, who ordered the... upside-down CAA-AA-AKE?",
  colors: ["steel"],
  cost: 1,
  illustrator: "Leonardo Giammichele",
  number: 199,
  set: "SSK",
  rarity: "uncommon",
};
