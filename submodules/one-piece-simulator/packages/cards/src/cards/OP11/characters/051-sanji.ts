import type { CharacterCard } from "@tcg/op-types";
import { op11Sanji051I18n } from "./051-sanji.i18n.ts";

export const op11Sanji051: CharacterCard = {
  id: "OP11-051",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP11",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew The Vinsmoke Family"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-051_p1.jpg",
      imageId: "OP11-051_p1",
    },
  ],
  effect:
    "When this Character is K.O.'d by your opponent's effect, look at 5 cards from the top of your deck and play up to 1 \"Straw Hat Crew\" type Character card with a cost of 5 or less. Then, place the rest at the bottom of your deck in any order.\n[On Play] Return up to 1 Character with 5000 base power or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11Sanji051I18n,
};
