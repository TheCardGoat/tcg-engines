import type { LeaderCard } from "@tcg/op-types";
import { op12Sanji041I18n } from "./041-sanji.i18n.ts";

export const op12Sanji041: LeaderCard = {
  id: "OP12-041",
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "OP12",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew The Vinsmoke Family"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-041_p1_qrKax4r.jpg",
      imageId: "OP12-041_p1",
    },
  ],
  effect:
    '[Activate: Main] [Once Per Turn] DON!! 1: Activate up to 1 "Straw Hat Crew" type Event with a base cost of 3 or less from your hand.\n[When Attacking] If the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field, add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op12Sanji041I18n,
};
