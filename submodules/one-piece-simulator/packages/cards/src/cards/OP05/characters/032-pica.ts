import type { CharacterCard } from "@tcg/op-types";
import { op05Pica032I18n } from "./032-pica.i18n.ts";

export const op05Pica032: CharacterCard = {
  id: "OP05-032",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP05",
  cost: 4,
  power: 6000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-032_p1.jpg",
      imageId: "OP05-032_p1",
    },
  ],
  effect:
    "[End of Your Turn] (1): Set this Character as active. [Once Per Turn] If this Character would be K.O.'d, you may rest up to 1 of your Characters with a cost of 3 or more other than [Pica] instead.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Pica",
              },
              {
                filter: "cost",
                comparison: "gte",
                value: 3,
              },
            ],
          },
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Pica032I18n,
};
