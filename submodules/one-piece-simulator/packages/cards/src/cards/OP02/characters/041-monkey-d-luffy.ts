import type { CharacterCard } from "@tcg/op-types";
import { op02MonkeyDLuffy041I18n } from "./041-monkey-d-luffy.i18n.ts";

export const op02MonkeyDLuffy041: CharacterCard = {
  id: "OP02-041",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP02",
  cost: 7,
  power: 7000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-041_p1.jpg",
      imageId: "OP02-041_p1",
    },
  ],
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Play up to 1 "FILM" or "Straw Hat Crew" type Character card with a cost of 4 or less from your hand.',
  effects: {
    keywords: ["blocker"],
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "FILM",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op02MonkeyDLuffy041I18n,
};
