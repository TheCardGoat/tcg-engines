import type { CharacterCard } from "@tcg/op-types";
import { op09Sanji065I18n } from "./065-sanji.i18n.ts";

export const op09Sanji065: CharacterCard = {
  id: "OP09-065",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP09",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-065_p1.jpg",
      imageId: "OP09-065_p1",
    },
  ],
  effect:
    "[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: This Character gains [Rush] during this turn. Then, rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
          {
            action: "rest",
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
                  value: 6,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Sanji065I18n,
};
