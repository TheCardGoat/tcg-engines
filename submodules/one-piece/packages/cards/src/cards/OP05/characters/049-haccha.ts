import type { CharacterCard } from "@tcg/op-types";
import { op05Haccha049I18n } from "./049-haccha.i18n.ts";

export const op05Haccha049: CharacterCard = {
  id: "OP05-049",
  canonicalId: "OP05-049",
  slug: "haccha",
  name: "Haccha",
  printings: [
    {
      id: "OP05-049",
      artId: "OP05-049",
      setCode: "OP05",
      collectorNumber: "049",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-049.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP05",
  cost: 6,
  power: 7000,
  traits: ["Animal Kingdom Pirates Giant"],
  attribute: "strike",
  effect:
    "[DON!! x1][When Attacking] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05Haccha049I18n,
};
