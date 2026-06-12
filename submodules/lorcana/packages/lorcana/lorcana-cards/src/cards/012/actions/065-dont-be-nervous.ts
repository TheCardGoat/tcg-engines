import type { ActionCard } from "@tcg/lorcana-types";
import { dontBeNervousI18n } from "./065-dont-be-nervous.i18n";

export const dontBeNervous: ActionCard = {
  id: "2F6",
  canonicalId: "ci_2F6",
  reprints: ["set12-065"],
  cardType: "action",
  name: "Don't Be Nervous",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 65,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_2718faa7b40f4af8b29f6d467dbc81bc",
  },
  text: "Search your deck for a Princess character card, reveal that card to all players, and put it into your hand. Then, shuffle your deck. If you have 2 or more Seven Dwarfs characters in play, draw 2 cards and gain 2 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search-deck",
            cardType: "character",
            classification: "Princess",
            putInto: "hand",
            reveal: true,
            shuffle: true,
          },
          {
            type: "conditional",
            condition: {
              type: "has-character-count",
              controller: "you",
              classification: "Seven Dwarfs",
              comparison: "greater-or-equal",
              count: 2,
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "draw",
                  amount: 2,
                  target: "CONTROLLER",
                },
                {
                  type: "gain-lore",
                  amount: 2,
                  target: "CONTROLLER",
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: dontBeNervousI18n,
};
