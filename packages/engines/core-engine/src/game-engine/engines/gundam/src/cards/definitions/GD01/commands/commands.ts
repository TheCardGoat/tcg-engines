import { mainOrActionAbility } from "~/game-engine/engines/gundam/src/abilities/abilities";
import {
  discardACard,
  drawXCard,
} from "~/game-engine/engines/gundam/src/abilities/effects/effects";
import type { GundamitoCommandCard } from "../../cardTypes";

export const firstContact: GundamitoCommandCard = {
  id: "GD01-107",
  implemented: true,
  cost: 3,
  level: 3,
  name: "First Contact",
  type: "command",
  abilities: [
    {
      type: "main",
      name: "First Contact",
      text: "Place 1 rested Resource.",
      effects: [
        {
          type: "move",
          to: "resource",
          target: {
            type: "card",
            value: 1,
            random: true,
            filters: [
              { filter: "zone", value: "resourceDeck" },
              { filter: "owner", value: "self" },
            ],
          },
          rested: true,
        },
      ],
    },
  ],
  rarity: "rare",
  color: "green",
  number: 107,
  set: "GD01",
};

export const overflowingAffection: GundamitoCommandCard = {
  id: "GD01-118",
  implemented: true,
  cost: 1,
  level: 2,
  name: "Overflowing Affection",
  type: "command",
  abilities: [
    {
      type: "main",
      name: "Overflowing Affection",
      text: "Draw 2. Then, discard 1.",
      effects: [discardACard, drawXCard(2)],
    },
  ],
  rarity: "uncommon",
  color: "white",
  number: 118,
  set: "GD01",
};

export const theWitchAndTheBride: GundamitoCommandCard = {
  id: "GD01-117",
  implemented: true,
  cost: 2,
  level: 5,
  name: "The Witch and the Bride",
  type: "command",
  abilities: [
    ...mainOrActionAbility({
      name: "The Witch and the Bride",
      text: "Choose 1 enemy Unit with 5 or less HP. Return it to its onwer's hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "battle" },
              { filter: "owner", value: "opponent" },
              { filter: "type", value: "unit" },
              {
                filter: "attribute",
                value: "hp",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    }),
  ],
  rarity: "rare",
  color: "white",
  number: 117,
  set: "GD01",
};

export const interceptOrders: GundamitoCommandCard = {
  id: "GD01-099",
  implemented: false,
  cost: 2,
  level: 4,
  name: "Intercept Orders",
  type: "command",
  abilities: [
    ...mainOrActionAbility({
      name: "Intercept Orders",
      text: "Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
      effects: [
        {
          type: "rest",
          rest: true,
          target: {
            type: "card",
            value: 2,
            filters: [
              { filter: "zone", value: "battle" },
              { filter: "owner", value: "opponent" },
              {
                filter: "attribute",
                value: "hp",
                comparison: { operator: "lte", value: 3 },
              },
            ],
          },
        },
      ],
    }),
  ],
  rarity: "rare",
  color: "blue",
  number: 99,
  set: "GD01",
};

export const takeAStandCitizens: GundamitoCommandCard = {
  id: "GD01-100",
  implemented: true,
  set: "GD01",
  rarity: "rare",
  number: 100,
  color: "green",
  cost: 1,
  level: 2,
  name: "Take a Stand, Citizens",
  type: "command",
  abilities: [
    {
      type: "main",
      name: "Take a Stand, Citizens",
      text: "All your Units get AP+2 during this turn.",
      effects: [
        {
          type: "attribute",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "battle" },
              { filter: "type", value: "unit" },
            ],
          },
          attribute: "ap",
          amount: 2,
          modifier: "add",
          duration: 1,
        },
      ],
    },
    // {
    //   type: "burst",
    //   name: "Take a Stand, Citizens",
    //   text: "Add this card to your hand.",
    //   effects: [
    //     {
    //       type: "move",
    //       to: "hand",
    //       target: {
    //         type: "card",
    //         value: 1,
    //         filters: [{ filter: "id", value: "GD01-100" }],
    //       },
    //     },
    //   ],
    // },
  ],
};
