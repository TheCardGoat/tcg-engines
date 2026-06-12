import type { ActionCard } from "@tcg/lorcana-types";
import { rightBehindYouI18n } from "./064-right-behind-you.i18n";

export const rightBehindYou: ActionCard = {
  id: "L0a",
  canonicalId: "ci_L0a",
  reprints: ["set12-064"],
  cardType: "action",
  name: "Right Behind You",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 64,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_ff9b8c01070340d5ba17656c5ef0c2bf",
  },
  text: "Draw a card. If you have a Seven Dwarfs character and a Princess character in play, you may play a Seven Dwarfs character for free.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                {
                  type: "has-character-with-classification",
                  classification: "Seven Dwarfs",
                  controller: "you",
                },
                {
                  type: "has-character-with-classification",
                  classification: "Princess",
                  controller: "you",
                },
              ],
            },
            then: {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "play-card",
                from: "hand",
                cardType: "character",
                cost: "free",
                filter: {
                  classification: "Seven Dwarfs",
                },
              },
            },
          },
        ],
      },
    },
  ],
  i18n: rightBehindYouI18n,
};
