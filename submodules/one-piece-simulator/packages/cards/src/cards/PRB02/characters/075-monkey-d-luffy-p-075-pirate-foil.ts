import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDLuffyP075PirateFoil075I18n } from "./075-monkey-d-luffy-p-075-pirate-foil.i18n.ts";

export const prb02MonkeyDLuffyP075PirateFoil075: CharacterCard = {
  id: "P-075",
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "PRB02",
  cost: 7,
  power: 7000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-075_r1.jpg",
      imageId: "P-075_r1",
    },
  ],
  effect:
    "[On Play] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.[When Attacking] If you have a Character with a cost of 8 or more on your field, draw 1 card and trash 1 card from your hand.Disclaimer: This card was reprinted from the original set with a different border (Note: the original print had a full art border).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb02MonkeyDLuffyP075PirateFoil075I18n,
};
