import type { CharacterCard } from "@tcg/op-types";
import { op12MonkeyDLuffy015I18n } from "./015-monkey-d-luffy.i18n.ts";

export const op12MonkeyDLuffy015: CharacterCard = {
  id: "OP12-015",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP12",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-015_p1_J5H7muC.jpg",
      imageId: "OP12-015_p1",
    },
  ],
  effect:
    "If you have a total of 2 or more given DON!! cards, this Character gains +2000 power.\n[On Play] You may reveal 2 Events from your hand: Play up to 1 red Character card with 3000 power or less from your hand. Then, give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 3000,
              },
              {
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
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
  i18n: op12MonkeyDLuffy015I18n,
};
