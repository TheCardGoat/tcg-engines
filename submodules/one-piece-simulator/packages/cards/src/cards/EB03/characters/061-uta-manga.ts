import type { CharacterCard } from "@tcg/op-types";
import { eb03UtaManga061I18n } from "./061-uta-manga.i18n.ts";

export const eb03UtaManga061: CharacterCard = {
  id: "EB03-061",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "EB03",
  cost: 7,
  power: 8000,
  traits: ["FILM"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-061_HLTqyf1.jpg",
      imageId: "EB03-061",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-061_p1_6QpKAbT.jpg",
      imageId: "EB03-061_p1",
    },
  ],
  effect:
    "[Activate: Main] [Once Per Turn] Set up to 1 of your DON!! cards as active. Then, rest up to 1 of your opponent's DON!! cards or Characters with a cost of 4 or less.[End of Your Turn] You may rest 1 of your DON!! cards: Set up to 1 of your {FILM} type Characters as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
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
                  value: "FILM",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03UtaManga061I18n,
};
