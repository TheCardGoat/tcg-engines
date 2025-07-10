import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import {
  type ActivatedAbility,
  challengerAbility,
  resistAbility,
  yourCharactersNamedGain,
  yourOtherCharactersGet,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import {
  chosenCharacter,
  chosenCharacterOfYours,
} from "@lorcanito/lorcana-engine/abilities/target";
import {
  anyCard,
  namedCard,
  self,
  yourLocationCards,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  wheneverACharacterQuests,
  wheneverOneOfYourCharactersIsBanishedInAChallenge,
  wheneverOneOfYourCharsQuests,
  wheneverOpposingCharIsBanishedInChallenge,
} from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import {
  discardACard,
  drawACard,
  lookAtTopCardOfYourDeckAndPutItOnTopOrBottom,
  putTopCardOfYourDeckIntoYourInkwellExerted,
  readyThisItem,
  returnChosenCharacterWithCostLess,
  youPayXLessToPlayNextActionThisTurn,
  youPayXLessToPlayNextCharThisTurn,
  youPayXLessToPlayNextItemThisTurn,
  youPayXLessToPlayNextLocationThisTurn,
} from "@lorcanito/lorcana-engine/effects/effects";

export const cleansingRainwater: LorcanitoItemCard = {
  id: "vlr",
  name: "Cleansing Rainwater",
  characteristics: ["item"],
  text: "**ANCIENT POWER** Banish this item – Remove up to 2 damage from each of your characters.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "ANCIENT POWER",
      text: "Banish this item – Remove up to 2 damage from each of your characters.",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour: "Rainwater lands as stone melts and dragons fly again.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: 'Michael "Cookie" Niewiadomy',
  number: 29,
  set: "ITI",
  rarity: "common",
};
export const heartOfAtlantis: LorcanitoItemCard = {
  id: "cxw",
  missingTestCase: true,
  name: "Heart of Atlantis",
  characteristics: ["item"],
  text: "**LIFE GIVER** {E} – You pay 2 {I} less for the next character you play this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "LIFE GIVER",
      costs: [{ type: "exert" }],
      text: " {E} – You pay 2 {I} less for the next character you play this turn.",
      effects: [youPayXLessToPlayNextCharThisTurn(2)],
    },
  ],
  flavour: "It’s what’s keeping you–all of Atlantis–alive! \n–Milo Thatch",
  colors: ["amber"],
  cost: 4,
  illustrator: "Elliot Baum / Viv Tanner",
  number: 30,
  set: "ITI",
  rarity: "rare",
};
export const wildcatsWrench: LorcanitoItemCard = {
  id: "d8n",
  name: "Wildcat’s Wrench",
  characteristics: ["item"],
  text: "**REBUILD** {E} – Remove up to 2 damage from chosen location.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Rebuild",
      text: "{E} – Remove up to 2 damage from chosen location.",
      optional: false,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "location" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "The right tool makes all the difference.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Ellie Horie",
  number: 31,
  set: "ITI",
  rarity: "uncommon",
};
export const theSorcerersHat: LorcanitoItemCard = {
  id: "h9u",
  name: "The Sorcerer's Hat",
  characteristics: ["item"],
  text: "**INCREDIBLE ENERGY** {E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Incredible Energy",
      text: "{E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      nameACard: true,
      effects: [
        {
          type: "reveal-top-card",
          target: namedCard,
          onTargetMatchEffects: [
            {
              type: "move",
              to: "hand",
              target: anyCard,
            },
          ],
        },
      ],
    },
  ],
  flavour:
    "Minnie approached it cautiously. Whoever had placed it here might have prepared traps.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Jiahui Eva Gao",
  number: 65,
  set: "ITI",
  rarity: "rare",
};
export const airfoil: LorcanitoItemCard = {
  id: "v9z",
  missingTestCase: true,
  name: "Airfoil",
  characteristics: ["item"],
  text: "**I GOT TO BE GOING** {E} – If you’ve played 2 or more actions this turn, draw a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "I Got to be Going",
      text: "{E} − If you’ve played 2 or more actions this turn, draw a card.",
      optional: false,
      costs: [{ type: "exert" }],
      conditions: [
        { type: "played-actions", comparison: { operator: "gte", value: 2 } },
      ],
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    },
  ],
  flavour: "Discovered in the lost Sea Duck, it looked good as new.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Jenna Gray",
  number: 97,
  set: "ITI",
  rarity: "common",
};
export const robinsBow: LorcanitoItemCard = {
  id: "b4u",
  missingTestCase: true,
  name: "Robin's Bow",
  characteristics: ["item"],
  text: "**FOREST’S GIFT** {E} – Deal 1 damage to chosen damaged character or location.\n\n\n**A BIT OF A LARK** Whenever a character of yours named Robin Hood quests, you may ready this item.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "FOREST’S GIFT",
      text: "{E} – Deal 1 damage to chosen damaged character or location.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "damage",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["location", "character"] },
              { filter: "zone", value: "play" },
              {
                filter: "status",
                value: "damage",
                comparison: { operator: "gte", value: 1 },
              },
            ],
          },
        },
      ],
    },
    wheneverACharacterQuests({
      name: "A bit of a Lark",
      text: "Whenever a character of yours named Robin Hood quests, you may ready this item.",
      optional: true,
      effects: [readyThisItem],
      characterFilter: [
        {
          filter: "attribute",
          value: "name",
          comparison: { operator: "eq", value: "robin hood" },
        },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
        { filter: "zone", value: "play" },
      ],
    }),
  ],
  flavour: "The forest always provides just what you need. \n–Robin Hood",
  colors: ["emerald"],
  cost: 3,
  illustrator: "McKay Anderson",
  number: 98,
  set: "ITI",
  rarity: "uncommon",
};
export const mauisFishHook: LorcanitoItemCard = {
  id: "ya5",
  name: "Maui's Fish Hook",
  characteristics: ["item"],
  text: "**IT'S MAUI TIME!** If you have a character named Maui in play, you may use this item's Shapeshift ability for free.\n\n\n**SHAPESHIFT** {E}, 2 {I} – Choose one:\n\n· Chosen character gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_\n\n· Chosen character gets +3 {S} this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Shapeshift",
      text: "{E}, 2 {I} – Choose one: Chosen character gains **Evasive** until the start of your next turn. Chosen character gets +3 {S} this turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Chosen character gains **Evasive** until the start of your next turn.",
              effects: [
                {
                  type: "ability",
                  ability: "evasive",
                  modifier: "add",
                  duration: "next_turn",
                  until: true,
                  target: chosenCharacter,
                },
              ],
            },
            {
              id: "2",
              text: "Chosen character gets +3 {S} this turn.",
              effects: [
                {
                  type: "attribute",
                  attribute: "strength",
                  amount: 3,
                  modifier: "add",
                  duration: "turn",
                  target: chosenCharacter,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Peter Brockhammer",
  number: 132,
  set: "ITI",
  rarity: "rare",
};
export const sumerianTalisman: LorcanitoItemCard = {
  id: "ui2",
  missingTestCase: true,
  name: "Sumerian Talisman",
  characteristics: ["item"],
  text: "**SOURCE OF MAGIC** During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
  type: "item",
  abilities: [
    wheneverOneOfYourCharactersIsBanishedInAChallenge({
      name: "Source of Magic",
      text: "During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
      optional: true,
      conditions: [{ type: "during-turn", value: "self" }],
      triggerFilter: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
      ],
      effects: [drawACard],
    }),
  ],
  flavour:
    "Summoned spirit from the dark \nShow thyself before this arc. \n−Lena Sabrewing",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Adam Bunch",
  number: 133,
  set: "ITI",
  rarity: "uncommon",
};
export const aurelianGyrosensor: LorcanitoItemCard = {
  id: "zc9",
  missingTestCase: true,
  name: "Aurelian Gyrosensor",
  characteristics: ["item"],
  text: "**SEEKING KNOWLEDGE** Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  type: "item",
  abilities: [
    wheneverOneOfYourCharsQuests({
      name: "Seeking Knowledge",
      text: "Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      optional: true,
      effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
    }),
  ],
  flavour:
    "It can point toward lost lore, but if you're not careful, it'll lead you off a cliff. \n−Venturo, an Illumineer",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Mario Oscar Gabriele",
  number: 163,
  set: "ITI",
  rarity: "rare",
};
export const luckyDime: LorcanitoItemCard = {
  id: "r2f",
  name: "Lucky Dime",
  characteristics: ["item"],
  text: "**NUMBER ONE** {E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Number one",
      text: "{E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.",
      optional: false,
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "from-target-card-to-target-player",
          player: "card-owner",
          target: chosenCharacterOfYours,
          effects: [
            {
              type: "lore",
              modifier: "add",
              target: self,
              amount: {
                dynamic: true,
                target: { attribute: "lore" },
              },
            },
          ],
        },
      ],
    },
  ],
  flavour: "This one simple coin changed Scrooge’s life forever.",
  colors: ["sapphire"],
  cost: 7,
  illustrator: "Leonardo Giammichele",
  number: 165,
  set: "ITI",
  rarity: "legendary",
};
export const scroogesTopHat: LorcanitoItemCard = {
  id: "jzq",
  missingTestCase: true,
  name: "Scrooge's Top Hat",
  characteristics: ["item"],
  text: "**BUSINESS EXPERTISE** {E} – Choose one: You pay 1 {I} less to play your next action this turn. You pay 1 {I} less to play your next item this turn. You pay 1 {I} less to play your next location this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "PENNY PINCHER",
      text: "{E} – Choose one: You pay 1 {I} less to play your next action this turn. You pay 1 {I} less to play your next item this turn. You pay 1 {I} less to play your next location this turn.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "modal",
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "You pay 1 {I} less to play your next action this turn.",
              effects: [youPayXLessToPlayNextActionThisTurn(1)],
            },
            {
              id: "2",
              text: "You pay 1 {I} less to play your next item this turn.",
              effects: [youPayXLessToPlayNextItemThisTurn(1)],
            },
            {
              id: "3",
              text: "You pay 1 {I} less to play your next location this turn.",
              effects: [youPayXLessToPlayNextLocationThisTurn(1)],
            },
          ],
        },
      ],
    },
  ],
  flavour: "Just the thing to top off another brilliant deal.",
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Gabriel Angelo",
  number: 166,
  set: "ITI",
  rarity: "uncommon",
};
export const vaultDoor: LorcanitoItemCard = {
  id: "doz",
  name: "Vault Door",
  characteristics: ["item"],
  text: "**SEALED AWAY** Your locations and character at locations gain **Resist** +1. _(Damage dealt to them is reduced by 1.)_",
  type: "item",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Sealed Away",
      text: "Your locations and character at locations gain **Resist** +1",
      gainedAbility: resistAbility(1),
      target: {
        type: "card",
        value: "all",
        filters: [
          {
            filter: "type",
            value: "location",
          },
          { filter: "owner", value: "self" },
        ],
      },
    },
    {
      type: "static",
      ability: "gain-ability",
      name: "Sealed Away",
      text: "Your locations and character at locations gain **Resist** +1",
      gainedAbility: resistAbility(1),
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "owner", value: "self" },
          {
            filter: "type",
            value: "character",
          },
          {
            filter: "status",
            value: "at-location",
          },
        ],
      },
    },
  ],
  flavour:
    "Only Scrooge knows about this vault. And he’s going to keep it that way.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Nicolas Ky",
  number: 167,
  set: "ITI",
  rarity: "common",
};
export const captainHooksRapier: LorcanitoItemCard = {
  id: "wmj",
  missingTestCase: true,
  name: "Captain Hook’s Rapier",
  characteristics: ["item"],
  text: "**GET THOSE SCURVY BRATS!** During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.\n\n\n**LET’S HAVE AT IT!</** Your characters named Captain Hook gain **Challenger** +1. _(They get +1 {S} while challenging.)_",
  type: "item",
  abilities: [
    wheneverOpposingCharIsBanishedInChallenge({
      name: "Get Those Scurvy Brats!",
      text: "During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
      optional: true,
      costs: [{ type: "ink", amount: 1 }],
      effects: [drawACard],
    }),
    yourCharactersNamedGain({
      name: "Captain Hook",
      ability: challengerAbility(1),
      excludeSelf: true,
    }),
  ],
  colors: ["steel"],
  cost: 3,
  illustrator: "Jeremy Adams",
  number: 199,
  set: "ITI",
  rarity: "uncommon",
};
export const gizmosuit: LorcanitoItemCard = {
  id: "f01",
  missingTestCase: true,
  name: "Gizmosuit",
  characteristics: ["item"],
  text: "**CYBERNETIC ARMOR** Banish this item – Chosen character gains **Resist** +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "banish" }],
      text: "Banish this item – Chosen character gains **Resist** +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 2,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour:
    "It stands in the Hall of Lorcana, waiting for someone to speak the secret words.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Dustin Panzino",
  number: 200,
  set: "ITI",
  rarity: "common",
};

export const mapOfTreasurePlanet: LorcanitoItemCard = {
  id: "x73",
  name: "Map of Treasure Planet",
  characteristics: ["item"],
  text: "**KEY TO THE PORTAL** {E} – You pay 1 {I} less for the next location you play this turn.\n\n\n**SHOW THE WAY** You pay 1 {I} less to move your characters to a location.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      name: "**KEY TO THE PORTAL**",
      text: "{E} – You pay 1 {I} less for the next location you play this turn.",
      effects: [youPayXLessToPlayNextLocationThisTurn(1)],
    },
    yourOtherCharactersGet({
      name: "Show the Way",
      text: "You pay 1 {I} less to move your characters to a location.",
      effects: [
        {
          type: "attribute",
          attribute: "moveCost",
          amount: 1,
          modifier: "subtract",
          target: yourLocationCards,
        },
      ],
    }),
  ],
  flavour: "Gentlemen, this must be kept under lock and key. \n−Captain Amelia",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Gabriel Angelo",
  number: 201,
  set: "ITI",
  rarity: "rare",
};

export const theLamp: LorcanitoItemCard = {
  id: "byw",
  name: "The Lamp",
  characteristics: ["item"],
  text: "**GOOD OR EVIL** Banish this item – If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "GOOD OR EVIL",
      text: "Banish this item – If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
      costs: [{ type: "banish" }],
      resolveEffectsIndividually: true,
      effects: [
        {
          ...returnChosenCharacterWithCostLess(4),
          conditions: [ifYouHaveCharacterNamed("Genie")],
        },
        {
          type: "draw",
          amount: 2,
          target: self,
          conditions: [ifYouHaveCharacterNamed("Jafar")],
        },
      ],
    },
  ],
  colors: ["amethyst"],
  illustrator: "Ever Galvez / Anna Stosik",
  number: 64,
  cost: 2,
  set: "ITI",
  rarity: "rare",
};
export const starlightVial: LorcanitoItemCard = {
  id: "f2k",
  missingTestCase: true,
  name: "Starlight Vial",
  characteristics: ["item"],
  text: "**EFFICIENT ENERGY** {E} – You pay 2 {I} less for the next action you play this turn.\n\n\n**TRAP** 2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
      name: "Trap",
      text: "2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.",
      resolveEffectsIndividually: true,
      effects: [discardACard, drawACard, drawACard],
    },
    {
      type: "activated",
      name: "**EFFICIENT ENERGY**",
      costs: [{ type: "exert" }],
      text: "{E} – You pay 2 {I} less for the next action you play this turn.",
      effects: [youPayXLessToPlayNextActionThisTurn(2)],
    },
  ],
  flavour: "In the wrong hands, this vial of magic could be disastrous.",
  colors: ["emerald"],
  illustrator: "Billy Wimblett",
  number: 99,
  set: "ITI",
  rarity: "rare",
  cost: 4,
};
export const heartOfTeFiti: LorcanitoItemCard = {
  id: "fzw",
  missingTestCase: true,
  name: "Heart of Te Fiti",
  characteristics: ["item"],
  text: "**CREATE LIFE** {E}, 2 {I} – Put the top card of your deck into your inkwell facedown and exerted.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Create Life",
      text: "{E}, 2 {I} – Put the top card of your deck into your inkwell facedown and exerted.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
    },
  ],
  flavour: "It takes a pure heart to calm the raging storm within.",
  inkwell: true,
  colors: ["sapphire"],
  illustrator: "Kamil Murzyn",
  number: 164,
  cost: 3,
  set: "ITI",
  rarity: "rare",
};
