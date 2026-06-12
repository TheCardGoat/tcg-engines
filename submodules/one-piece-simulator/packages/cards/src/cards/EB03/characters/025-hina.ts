import type { CharacterCard } from "@tcg/op-types";
import { eb03Hina025I18n } from "./025-hina.i18n.ts";

export const eb03Hina025: CharacterCard = {
  id: "EB03-025",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-025_p1_TkJFyRd.jpg",
      imageId: "EB03-025_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from your hand: Return up to 1 Character with 6000 base power to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
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
                  filter: "basePower",
                  comparison: "eq",
                  value: 6000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Hina025I18n,
};
