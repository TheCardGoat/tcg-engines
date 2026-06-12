import type { CharacterCard } from "@tcg/op-types";
import { op10Lim037I18n } from "./037-lim.i18n.ts";

export const op10Lim037: CharacterCard = {
  id: "OP10-037",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-037_p1.jpg",
      imageId: "OP10-037_p1",
    },
  ],
  effect:
    '[Once Per Turn] If this Character would be removed from the field by your opponent\'s effect, you may rest 1 of your "ODYSSEY" type Characters instead.[End of Your Turn] Set up to 1 of your "ODYSSEY" type Characters as active.',
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "ODYSSEY",
                },
              ],
            },
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            filters: [
              {
                filter: "trait",
                value: "ODYSSEY",
              },
            ],
          },
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10Lim037I18n,
};
