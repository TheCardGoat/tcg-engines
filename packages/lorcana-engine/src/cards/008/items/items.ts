import type {
  CardEffectTarget,
  LorcanitoItemCard,
} from "@lorcanito/lorcana-engine";
import {
  type ActivatedAbility,
  exertCharCost,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import {
  chosenCharacter,
  chosenOpposingCharacter,
  topCardOfYourDeck,
  yourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  whenChallenged,
  whenYouPlayThisForEachYouPayLess,
} from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverYouPlayACharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { targetCardsGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import {
  chosenCharacterGainsResist,
  chosenCharacterGainsSupport,
  chosenCharacterGetsStrength,
  putTopCardOfYourDeckIntoYourInkwellExerted,
  readyAndCantQuest,
  targetCardGainsResist,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { RevealTopCardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

export const theNephewsPiggyBank: LorcanitoItemCard = {
  id: "s8i",
  missingTestCase: true,
  name: "The Nephews' Piggy Bank",
  characteristics: ["item"],
  text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.\nPAYOFF {e} – Chosen character gets -1 {S} until the start of your next turn.",
  type: "item",
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  illustrator: "Jeremy Adams",
  number: 44,
  set: "008",
  rarity: "uncommon",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "INSIDE JOB",
      text: "If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.",
      amount: 1,
      conditions: [ifYouHaveCharacterNamed("Donald Duck")],
    }),
    {
      type: "activated",
      name: "PAYOFF",
      text: "{e} – Chosen character gets -1 {S} until the start of your next turn.",
      costs: [{ type: "exert" }],
      effects: [chosenCharacterGetsStrength(-1, "next_turn")],
    },
  ],
};

export const scarab: LorcanitoItemCard = {
  id: "pv5",
  name: "Scarab",
  characteristics: ["item"],
  text: "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.",
  type: "item",
  inkwell: false,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Carlos Ruiz",
  number: 83,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "activated",
      name: "SEARCH THE SANDS",
      text: "{E} 2 {I} – Return an Illusion character card from your discard to your hand.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
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
              { filter: "characteristics", value: ["illusion"] },
            ],
          },
        },
      ],
    },
  ],
};

export const iceSpikes: LorcanitoItemCard = {
  id: "jvt",
  missingTestCase: true,
  name: "Ice Spikes",
  characteristics: ["item"],
  text: "HOLD STILL When you play this item, exert chosen opposing character.\nIT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can't ready at the start of its next turn.",
  type: "item",
  inkwell: true,
  colors: ["amethyst", "sapphire"],
  cost: 2,
  illustrator: "Priya Kakati",
  number: 84,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "resolution",
      name: "HOLD STILL",
      text: "When you play this item, exert chosen opposing character.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenOpposingCharacter,
        },
      ],
    },
    {
      type: "activated",
      name: "IT'S STUCK",
      text: "{E}, 1 {I} – Exert chosen opposing item. It can't ready at the start of its next turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
        {
          type: "restriction",
          restriction: "ready-at-start-of-turn",
          duration: "next_turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    },
  ],
};

export const chemPurse: LorcanitoItemCard = {
  id: "xcs",
  name: "Chem Purse",
  characteristics: ["item"],
  text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
  type: "item",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Jared Nickel",
  number: 119,
  set: "008",
  rarity: "common",
  abilities: [
    wheneverYouPlayACharacter({
      name: "HERE'S THE BEST PART",
      text: "Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
      hasShifted: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 4,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "trigger" }],
          },
        },
      ],
    }),
  ],
};

export const hamsterBall: LorcanitoItemCard = {
  id: "oq5",
  name: "Hamster Ball",
  characteristics: ["item"],
  text: "ROLL WITH THE PUNCHES {E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  type: "item",
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  illustrator: "Alex Accorsi",
  number: 204,
  set: "008",
  rarity: "common",
  abilities: [
    {
      type: "activated",
      name: "ROLL WITH THE PUNCHES",
      text: "{E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [
        targetCardGainsResist({
          amount: 2,
          duration: "next_turn",
          target: {
            ...chosenCharacter,
            filters: [
              ...chosenCharacter.filters,
              { filter: "status", value: "damaged", negate: true },
            ],
          },
        }),
      ],
    },
  ],
};

export const jeweledCollar: LorcanitoItemCard = {
  id: "xhq",
  name: "Jeweled Collar",
  characteristics: ["item"],
  text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "item",
  inkwell: true,
  colors: ["emerald", "sapphire"],
  cost: 2,
  illustrator: "Filipe Laurentino",
  number: 120,
  set: "008",
  rarity: "uncommon",
  abilities: [
    targetCardsGains({
      name: "WELCOME EXTRAVAGANCE",
      text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
      target: yourCharacters,
      ability: whenChallenged({
        name: "WELCOME EXTRAVAGANCE",
        text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
        optional: true,
        effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
      }),
    }),
  ],
};

export const theSwordOfShanYu: LorcanitoItemCard = {
  id: "zlc",
  name: "The Sword Of Shan Yu",
  characteristics: ["item"],
  text: "WORTHY WEAPON {E}, {E} one of your characters – Ready chosen character. They can’t quest for the rest of this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "WORTHY WEAPON",
      text: "{E}, {E} one of your characters – Ready chosen character. They can’t quest for the rest of this turn.",
      costs: [{ type: "exert" }, exertCharCost(1)],
      effects: [...readyAndCantQuest(chosenCharacter)],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Domenico Russo",
  number: 152,
  set: "008",
  rarity: "rare",
};

const puppyCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "characteristics", value: ["puppy"] },
  ],
};

const revealTopPuppyAndPutIntoHand: RevealTopCardEffect = {
  type: "reveal-top-card",
  target: puppyCharacter,
  onTargetMatchEffects: [
    {
      type: "move",
      to: "hand",
      shouldRevealMoved: true,
      target: topCardOfYourDeck,
    },
  ],
  onTargetMatchFailureEffects: [
    {
      type: "move",
      to: "deck",
      bottom: true,
      target: topCardOfYourDeck,
    },
  ],
};

const isItOnYet: ActivatedAbility = {
  type: "activated",
  name: "IS IT ON YET?",
  text: "{E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
  costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
  effects: [revealTopPuppyAndPutIntoHand],
};

export const televisionSet: LorcanitoItemCard = {
  id: "kqe",
  name: "Television Set",
  characteristics: ["item"],
  text: "IS IT ON YET? {E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
  type: "item",
  abilities: [isItOnYet],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 178,
  set: "008",
  rarity: "common",
};

export const bellesFavoriteBook: LorcanitoItemCard = {
  id: "yy4",
  name: "Belle's Favorite Book",
  characteristics: ["item"],
  text: "CHAPTER THREE {E}, Banish one of your other items – Put the top card of your deck into your inkwell facedown and exerted.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "CHAPTER THREE",
      text: "{E}, Banish one of your other items – Put the top card of your deck into your inkwell facedown and exerted.",
      costs: [
        { type: "exert" },
        {
          type: "card",
          action: "banish",
          amount: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            { filter: "type", value: "item" },
          ],
        },
      ],
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
    },
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Edgar Pasten",
  number: 179,
  set: "008",
  rarity: "rare",
};

export const atlanteanCrystal: LorcanitoItemCard = {
  id: "rb8",
  name: "Atlantean Crystal",
  characteristics: ["item"],
  text: "SHIELDING LIGHT {E}, 2 {I} – Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  type: "item",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Greez",
  number: 180,
  set: "008",
  rarity: "rare",
  abilities: [
    {
      type: "activated",
      name: "SHIELDING LIGHT",
      text: "{E}, 2 {I} – Chosen character gains Resist +2 and Support until the start of your next turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        chosenCharacterGainsResist(2, "next_turn"),
        chosenCharacterGainsSupport("next_turn"),
      ],
    },
  ],
};
