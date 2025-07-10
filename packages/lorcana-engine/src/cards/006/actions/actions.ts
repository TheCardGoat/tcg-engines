import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  chosenCharacterOfYours,
  chosenCharacterOrLocation,
  chosenOpposingCharacter,
  self,
  sourceTarget,
  thisCharacter,
  yourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  banishChosenItem,
  chosenCharacterGainsSupport,
  chosenOpposingCharacterCantQuestNextTurn,
  dealDamageEffect,
  discardACard,
  discardAllCardsInOpponentsHand,
  drawACard,
  drawXCards,
  exertChosenCharacter,
  mayBanish,
  millOpponentXCards,
  moveDamageEffect,
  opponentLoseLore,
  putDamageEffect,
  readyAndCantQuest,
  readyChosenCharacter,
  readyChosenItem,
  returnChosenCharacterWithCostLess,
  youGainLore,
  youMayPutAnAdditionalCardFromYourHandIntoYourInkwell,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { TargetConditionalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

export const energyBlast: LorcanitoActionCard = {
  id: "e8s",
  missingTestCase: true,
  name: "Energy Blast",
  characteristics: ["action"],
  text: "Banish chosen character. Draw a card.",
  type: "action",
  abilities: [
    { type: "resolution", effects: [mayBanish(chosenCharacter), drawACard] },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 7,
  strength: 0,
  illustrator: "Marco Giorgini",
  number: 131,
  set: "006",
  rarity: "rare",
};

export const goodJob: LorcanitoActionCard = {
  id: "jmf",
  name: "Good Job!",
  characteristics: ["action"],
  text: "Chosen character gets +1 {L} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Good Job!",
      text: "Chosen character gets +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Carlos Gomes Cabral",
  number: 27,
  set: "006",
  rarity: "common",
};

export const safeAndSound: LorcanitoActionCard = {
  id: "ypf",
  name: "Safe And Sound",
  characteristics: ["action"],
  text: "Chosen character of yours can't be challenged until the start of your next turn.",
  type: "action",
  abilities: [],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  illustrator: "Simone Tentoni",
  number: 30,
  set: "006",
  rarity: "rare",
};

export const mosquitoBite: LorcanitoActionCard = {
  id: "zw6",
  name: "Mosquito Bite",
  characteristics: ["action"],
  text: "Put 1 damage counter on chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [putDamageEffect(1, chosenCharacter)],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Kamil Murzyn",
  number: 96,
  set: "006",
  rarity: "uncommon",
};

export const theIslandsIPulledFromTheSea: LorcanitoActionCard = {
  id: "bnu",
  missingTestCase: true,
  name: "The Islands I Pulled From The Sea",
  characteristics: ["action", "song"],
  text: "(A character with cost 3 or more can {E} to sing this song for free.)\nSearch your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "shuffle-deck",
          target: self,
        },
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "location" },
            ],
          },
          forEach: [
            {
              type: "reveal",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "owner", value: "self" },
                  { filter: "type", value: "location" },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 3,
  strength: 0,
  illustrator: "Wietse Treurniet",
  number: 130,
  set: "006",
  rarity: "uncommon",
};

export const rescueRangersAway: LorcanitoActionCard = {
  id: "fhc",
  name: "Rescue Rangers Away!",
  characteristics: ["action"],
  text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Rescue Rangers Away!",
      text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: {
            dynamic: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,

  illustrator: "Mariana Moreno",
  number: 29,
  set: "006",
  rarity: "uncommon",
};

export const weCouldBeImmortals: LorcanitoActionCard = {
  id: "nb5",
  name: "We Could Be Immortals",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\nYour Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "We Could Be Immortals",
      text: "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 6,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "characteristics", value: ["inventor"] },
            ],
          },
        },
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  lore: 6,
  illustrator: "Ian MacDonald",
  number: 162,
  set: "006",
  rarity: "rare",
};

export const hotPotato: LorcanitoActionCard = {
  id: "uzc",
  missingTestCase: true,
  name: "Hot Potato",
  characteristics: ["action"],
  text: "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
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
              text: "Deal 2 damage to chosen character.",
              effects: [dealDamageEffect(2, chosenCharacter)],
            },
            {
              id: "2",
              text: "Banish chosen item.",
              effects: [banishChosenItem],
            },
          ],
        },
      ],
    },
  ],
  flavour: '"This is not going to end well." \n−Pleakley',
  inkwell: true,
  colors: ["steel"],
  cost: 3,

  illustrator: "Nicolas Ky",
  number: 195,
  set: "006",
  rarity: "uncommon",
};

export const aVeryMerryUnbirthday: LorcanitoActionCard = {
  id: "pfv",
  missingTestCase: true,
  name: "A Very Merry Unbirthday",
  characteristics: ["action", "song"],
  text: "(A character with cost 1 or more can {E} to sing this song for free.)\nEach opponent puts the top 2 cards of their deck into their discard.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "A Very Merry Unbirthday",
      text: "Each opponent puts the top 2 cards of their deck into their discard.",
      effects: millOpponentXCards(2),
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Geoffrey Bodeau",
  number: 60,
  set: "006",
  rarity: "common",
};

export const heffalumpsAndWoozles: LorcanitoActionCard = {
  id: "kml",
  name: "Heffalumps And Woozles",
  characteristics: ["song", "action"],
  text: "(A character with cost 2 or more can {E} to sing this song for free.)\nChosen opposing character can't quest during their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Heffalumps And Woozles",
      text: "Chosen opposing character can't quest during their next turn. Draw a card.",
      detrimental: true,
      resolveEffectsIndividually: true,
      effects: [chosenOpposingCharacterCantQuestNextTurn, drawACard],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Domenico Russo",
  number: 95,
  set: "006",
  rarity: "common",
};

export const helpingHand: LorcanitoActionCard = {
  id: "vl0",
  missingTestCase: true,
  name: "Helping Hand",
  characteristics: ["action"],
  text: "Chosen character gains Support this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Helping Hand",
      text: "Chosen character gains Support this turn. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [chosenCharacterGainsSupport("turn"), drawACard],
    },
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Therese Vildefall",
  number: 164,
  set: "006",
  rarity: "common",
};

export const iWontGiveIn: LorcanitoActionCard = {
  id: "ke2",
  missingTestCase: true,
  name: "I Won't Give In",
  characteristics: ["song", "action"],
  text: "(A character with cost 2 or more can {E} to sing this song for free.)\nReturn a character card with cost 2 or less from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "I Won't Give In",
      text: "Return a character card with cost 2 or less from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Natalia Trykowska",
  number: 28,
  set: "006",
  rarity: "common",
};

export const loseTheWay: LorcanitoActionCard = {
  id: "la7",
  name: "Lose The Way",
  characteristics: ["action"],
  text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
  type: "action",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Douglas De La Hoz",
  number: 63,
  set: "006",
  rarity: "uncommon",
  abilities: [
    {
      type: "resolution",
      name: "Lose The Way",
      text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
      effects: [
        {
          ...exertChosenCharacter,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: thisCharacter,
              replaceEffectTarget: true,
              resolveEffectsIndividually: true,
              optional: true,
              effects: [
                {
                  type: "restriction",
                  restriction: "ready-at-start-of-turn",
                  duration: "next_turn",
                  until: true,
                  target: sourceTarget,
                },
                discardACard,
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const prepareToBoard: LorcanitoActionCard = {
  id: "xwq",
  missingTestCase: true,
  name: "Prepare To Board!",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "target-conditional",
          autoResolve: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["pirate"] },
            ],
          },
          effects: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 3,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                  { filter: "characteristics", value: ["pirate"] },
                ],
              },
            },
          ],
          fallback: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 2,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                ],
              },
            },
          ],
        } as TargetConditionalEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Toni Bruno",
  number: 94,
  set: "006",
  rarity: "common",
};

export const thievery: LorcanitoActionCard = {
  id: "nf0",
  missingTestCase: true,
  name: "Thievery",
  characteristics: ["action"],
  text: "Chosen opponent loses 1 lore. Gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Thievery",
      text: "Chosen opponent loses 1 lore. Gain 1 lore.",
      effects: [opponentLoseLore(1), youGainLore(1)],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Antoine Couttolenc",
  number: 128,
  set: "006",
  rarity: "common",
};

export const prepareYourBot: LorcanitoActionCard = {
  id: "ht1",
  missingTestCase: true,
  name: "Prepare Your Bot",
  characteristics: ["action"],
  text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
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
              text: "Ready chosen item.",
              effects: [readyChosenItem],
            },
            {
              id: "2",
              text: "Ready chosen Robot character. They can't quest for the rest of this turn.",
              effects: readyAndCantQuest({
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                  { filter: "characteristics", value: ["robot"] },
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Ian MacDonald",
  number: 165,
  set: "006",
  rarity: "uncommon",
};

export const ambush: LorcanitoActionCard = {
  id: "s1l",
  name: "Ambush!",
  characteristics: ["action"],
  text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenCharacter,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              // TODO: get rid of target
              target: thisCharacter,
              resolveAmountBeforeCreatingLayer: true,
              effects: [
                dealDamageEffect(
                  {
                    dynamic: true,
                    target: {
                      attribute: "strength",
                    },
                  },
                  chosenCharacterOrLocation,
                ),
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  illustrator: "Ilaria Sposetti",
  number: 198,
  set: "006",
  rarity: "rare",
};

export const unfortunateSituation: LorcanitoActionCard = {
  id: "wcu",
  missingTestCase: true,
  name: "Unfortunate Situation",
  characteristics: ["action"],
  text: "Each opponent chooses one of their characters and deals 4 damage to them.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      responder: "opponent",
      effects: [dealDamageEffect(4, chosenCharacterOfYours)],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  illustrator: "Mariano Moreno",
  number: 199,
  set: "006",
  rarity: "uncommon",
};

export const showTheWay: LorcanitoActionCard = {
  id: "lfi",
  missingTestCase: true,
  name: "Lead The Way",
  characteristics: ["action"],
  text: "Your characters get +2 {S} this turn.",
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
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 0,
  illustrator: "Amanda MacFarlane",
  number: 129,
  set: "006",
  rarity: "common",
};

export const imStillHere: LorcanitoActionCard = {
  id: "aht",
  missingTestCase: true,
  name: "I'm Still Here",
  characteristics: ["song", "action"],
  text: "(A character with cost 3 or more can {E} to sing this song for free.)\nChosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "ability",
          ability: "resist",
          modifier: "add",
          amount: 2,
          until: true,
          duration: "next_turn",
          target: chosenCharacter,
        },
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 0,
  illustrator: "Mike Packer",
  number: 196,
  set: "006",
  rarity: "uncommon",
};

export const makeSomeMagic: LorcanitoActionCard = {
  id: "nle",
  missingTestCase: true,
  name: "Making Magic",
  characteristics: ["action"],
  text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      detrimental: true,
      resolveEffectsIndividually: true,
      effects: [
        moveDamageEffect({
          amount: 1,
          from: chosenCharacter,
          to: chosenOpposingCharacter,
        }),
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Mario Oscar Gabriele",
  number: 62,
  set: "006",
  rarity: "common",
};

export const seekingTheHalfCrown: LorcanitoActionCard = {
  id: "fdo",
  missingTestCase: true,
  name: "Seeking The Half Crown",
  characteristics: ["action"],
  text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
  type: "action",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      amount: {
        dynamic: true,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "characteristics", value: ["sorcerer"] },
        ],
      },
    }),
    {
      type: "resolution",
      effects: [drawXCards(2)],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 5,
  illustrator: "French Carlomagno",
  number: 64,
  set: "006",
  rarity: "rare",
};

export const youCameBack: LorcanitoActionCard = {
  id: "bl8",
  name: "You Came Back",
  characteristics: ["action"],
  text: "Ready chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [readyChosenCharacter],
    },
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Michaela Martin",
  number: 97,
  set: "006",
  rarity: "rare",
};

export const sailTheAzuriteSea: LorcanitoActionCard = {
  id: "dwo",
  name: "Sail The Azurite Sea",
  characteristics: ["action"],
  text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        youMayPutAnAdditionalCardFromYourHandIntoYourInkwell,
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 0,
  illustrator: "Valerio Buonfantino",
  number: 163,
  set: "006",
  rarity: "common",
};

export const twinFire: LorcanitoActionCard = {
  id: "c2j",
  name: "Twin Fire",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Twin Fire",
      text: "Then, you may choose and discard a card to deal 2 damage to another chosen character",
      optional: true,
      resolveEffectsIndividually: true,
      effects: [dealDamageEffect(2, chosenCharacter), discardACard],
    },
    {
      type: "resolution",
      name: "Twin Fire",
      text: "Deal 2 damage to chosen character.",
      effects: [dealDamageEffect(2, chosenCharacter)],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  illustrator: "Taraneth",
  number: 197,
  set: "006",
  rarity: "common",
};

export const submitToMyWill: LorcanitoActionCard = {
  id: "k46",
  missingTestCase: true,
  name: "Bend To My Will",
  characteristics: ["action"],
  text: "Each opponent discards all cards in their hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Submit to My Will",
      text: "Each opponent discards all cards in their hand.",
      effects: [discardAllCardsInOpponentsHand],
    },
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 7,
  illustrator: "Michela Cacciatore",
  number: 93,
  set: "006",
  rarity: "super_rare",
};
