import type { CharacterCard } from "@tcg/op-types";
import { op11MonkeyDLuffy118I18n } from "./118-monkey-d-luffy.i18n.ts";

export const op11MonkeyDLuffy118: CharacterCard = {
  id: "OP11-118",
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "OP11",
  cost: 8,
  power: 8000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-118_p2.jpg",
      imageId: "OP11-118_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-118_p1.jpg",
      imageId: "OP11-118_p1",
    },
  ],
  effect:
    "[Rush]\n[When Attacking] You may trash 1 card from your hand: Return up to 1 Character with a cost of 4 or less to the owner's hand. Then, give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenAttacking",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11MonkeyDLuffy118I18n,
};
