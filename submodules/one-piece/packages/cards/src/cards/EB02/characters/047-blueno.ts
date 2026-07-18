import type { CharacterCard } from "@tcg/op-types";
import { eb02Blueno047I18n } from "./047-blueno.i18n.ts";

export const eb02Blueno047: CharacterCard = {
  id: "EB02-047",
  canonicalId: "EB02-047",
  slug: "blueno/eb02-047",
  name: "Blueno",
  printings: [
    {
      id: "EB02-047",
      artId: "EB02-047",
      setCode: "EB02",
      collectorNumber: "047",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-047.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "strike",
  effect:
    '[Activate: Main] You may trash 1 card from your hand and trash this Character: Play up to 1 Character card with a type including "CP" and a cost of 5 or less other than [Blueno] from your trash.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Blueno",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "CP",
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
  i18n: eb02Blueno047I18n,
};
