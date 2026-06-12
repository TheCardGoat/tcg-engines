import type { CharacterCard } from "@tcg/op-types";
import { op14eb04EustassCaptainKidEb04039039I18n } from "./039-eustass-captain-kid-eb04-039.i18n.ts";

export const op14eb04EustassCaptainKidEb04039039: CharacterCard = {
  id: "EB04-039",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 7,
  power: 8000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-039_p1.png",
      imageId: "EB04-039_p1",
    },
  ],
  effect:
    "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.\n[Activate: Main] You may trash this Character: Play up to 1 {Kid Pirates} type Character card with a cost of 5 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
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
                value: 5,
              },
              {
                filter: "trait",
                value: "Kid Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04EustassCaptainKidEb04039039I18n,
};
