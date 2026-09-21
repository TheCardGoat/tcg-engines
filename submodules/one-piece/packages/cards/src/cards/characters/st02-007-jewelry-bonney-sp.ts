import type { CharacterCard } from "@tcg/op-types";
import { op08JewelryBonneySp007I18n } from "./st02-007-jewelry-bonney-sp.i18n.ts";

export const op08JewelryBonneySp007: CharacterCard = {
  id: "ST02-007",
  canonicalId: "ST02-007",
  slug: "jewelry-bonney-sp",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "ST02-007",
      artId: "ST02-007",
      setCode: "ST02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_p2.jpg",
      label: "Jewelry Bonney (SP)",
    },
    {
      id: "ST02-007_p3",
      artId: "ST02-007_p3",
      setCode: "ST02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_p3.jpg",
    },
    {
      id: "ST02-007_r1",
      artId: "ST02-007_r1",
      setCode: "ST02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_r1.jpg",
      label: "Jewelry Bonney - ST02-007 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    "[Activate: Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Look at 5 cards from the top of your deck; reveal up to 1 {Supernovas} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Supernovas",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08JewelryBonneySp007I18n,
};
