import type { CharacterCard } from "@tcg/op-types";
import { eb04Helmeppo047I18n } from "./eb04-047-helmeppo.i18n.ts";

export const eb04Helmeppo047: CharacterCard = {
  id: "EB04-047",
  canonicalId: "EB04-047",
  slug: "helmeppo/eb04-047",
  name: "Helmeppo",
  printings: [
    {
      id: "EB04-047",
      artId: "EB04-047",
      setCode: "EB04",
      collectorNumber: "047",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-047_4GHhyeo.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB04",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Navy SWORD"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may trash this Character: Play up to 1 {SWORD} type Character card with a cost of 3 or less other than [Helmeppo] from your hand or trash.",
  effects: {
    effects: [
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
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Helmeppo",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "SWORD",
                match: "includes",
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
  i18n: eb04Helmeppo047I18n,
};
