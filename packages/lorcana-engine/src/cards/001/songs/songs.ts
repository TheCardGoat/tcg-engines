import type { CardEffectTarget } from "@lorcanito/lorcana-engine";
import type { ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { ScryEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

export const friendsOnTheOtherSide: LorcanitoActionCard = {
  id: "rrg",

  name: "Friends On The Other Side",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song \rfor free.)_\n\rDraw 2 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "draw",
          amount: 2,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
      text: "Draw 2 cards.",
    },
  ],
  flavour: "The cards, the cards<br />\rthe cards will tell . . .",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Amber Kommavongsa",
  number: 64,
  set: "TFC",
  rarity: "common",
};
export const hakunaMatata: LorcanitoActionCard = {
  id: "ege",
  name: "Hakuna Matata",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nRemove up to 3 damage from each of your characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Hakuna Matata",
      text: "Remove up to 3 damage from each of your characters.",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "What a wonderful phrase!",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Juan Diego Leon",
  number: 27,
  set: "TFC",
  rarity: "common",
};
export const beOurGuest: LorcanitoActionCard = {
  id: "m6n",
  name: "Be Our Guest",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this\rsong for free.)_\nLook at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Be Our Guest",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      optional: false,
      effects: [
        {
          type: "scry",
          amount: 4,
          mode: "bottom",
          shouldRevealTutored: true,
          limits: {
            bottom: 4,
            inkwell: 0,
            top: 0,
            hand: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "deck" },
          ],
        } as ScryEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 25,
  set: "TFC",
  rarity: "uncommon",
};
export const partOfOurWorld: LorcanitoActionCard = {
  id: "ztz",
  name: "Part of Your World",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song\rfor free.)_\n Return a character card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Part of Your World",
      text: "Return a character card from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "What would I give\nIf I could live out of these waters?",
  colors: ["amber"],
  cost: 3,
  illustrator: "Samanta Erdini",
  number: 30,
  set: "TFC",
  rarity: "rare",
};
export const reflection: LorcanitoActionCard = {
  id: "brz",
  name: "Reflection",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this\nsong for free.)_\nLook at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Reflection",
      text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 3,
          mode: "top",
          target: {
            type: "player",
            value: "self",
          },
          limits: {
            top: 3,
            bottom: 0,
            hand: 0,
            inkwell: 0,
          },
        },
      ],
    },
  ],
  flavour: "When will my reflection show \nWho I am inside?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Kevin Hong",
  number: 65,
  set: "TFC",
  rarity: "common",
};
const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};
export const motherKnowsBest: LorcanitoActionCard = {
  id: "rxk",

  name: "Mother Knows Best",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this\nsong for free.)_\nReturn chosen character to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Mother Knows Best",
      text: "Return chosen character to their player's hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "One way or another \nSomething will go wrong, I swear",
  colors: ["emerald"],
  cost: 3,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 95,
  set: "TFC",
  rarity: "uncommon",
};
export const suddenChill: LorcanitoActionCard = {
  id: "pz4",
  name: "Sudden Chill",
  characteristics: ["action", "song"],
  text: "Each opponent chooses and discards a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Sudden Chill",
      text: "Each opponent chooses and discards a card.",
      optional: false,
      responder: "opponent",
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "Cruella De Vil, Cruella De Vil \nIf she doesn't scare you, no evil thing will",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Giulia Riva",
  number: 98,
  set: "TFC",
  rarity: "common",
};
export const bePrepared: LorcanitoActionCard = {
  id: "z06",

  name: "Be Prepared",
  characteristics: ["action", "song"],
  text: "_(A character with cost 7 or more can {E} to sing this\nsong for free.)_\nBanish all characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Be Prepared",
      text: "Banish all characters.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Out teeth and ambitions are bared!",
  colors: ["ruby"],
  cost: 7,
  illustrator: "Jared Nickerl",
  number: 128,
  set: "TFC",
  rarity: "rare",
};
export const letItGo: LorcanitoActionCard = {
  id: "n1y",

  name: "Let It Go",
  characteristics: ["action", "song"],
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nPut chosen character into their player's inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Let It Go",
      text: "Put chosen character into their player's inkwell facedown and exerted.",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour:
    "It's time to see what I can do<br />To test the limits and break through",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  illustrator: "Milica Celikovic",
  number: 163,
  set: "TFC",
  rarity: "rare",
};
export const oneJumpAhead: LorcanitoActionCard = {
  id: "gf6",

  name: "One Jump Ahead",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\nPut the top card of your deck into your inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "One Jump Ahead",
      text: "Put the top card of your deck into your inkwell facedown and exerted.",
      optional: false,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [{ filter: "top-deck", value: "self" }],
          },
        },
      ],
    },
  ],
  flavour:
    "Gotta eat to live, gotta steal to eat -\nTell you all about it when I got the time",
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Bill Robinson",
  number: 164,
  set: "TFC",
  rarity: "uncommon",
};
export const aWholeNewWorld: LorcanitoActionCard = {
  id: "u8m",
  name: "A Whole New World",
  characteristics: ["action", "song"],
  text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "A Whole New World",
      text: "Each player discards their hand and draws 7 cards.",
      effects: [
        {
          type: "discard",
          amount: 60,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "zone", value: "hand" }],
          },
        },
        {
          type: "draw",
          amount: 7,
          target: {
            type: "player",
            value: "all",
          },
        },
      ],
    },
  ],
  flavour: "Shining, shimmering, splendid . . .",
  colors: ["steel"],
  cost: 5,
  illustrator: "Koni",
  number: 195,
  set: "TFC",
  rarity: "super_rare",
};
export const grabYourSword: LorcanitoActionCard = {
  id: "u4k",

  name: "Grab Your Sword",
  characteristics: ["action", "song"],
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nDeal 2 damage to each opposing character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Grab Your Sword",
      text: "Deal 2 damage to each opposing character.",
      effects: [
        {
          type: "damage",
          amount: 2,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "We don't like\nwhat we don't understand\nIn fact, it scares us",
  colors: ["steel"],
  cost: 5,
  illustrator: "Peter Brockhammer",
  number: 198,
  set: "TFC",
  rarity: "rare",
};
