import type { CharacterCard } from "@tcg/op-types";
import { op14eb04DonquixoteRosinanteOp12108108I18n } from "./108-donquixote-rosinante-op12-108.i18n.ts";

export const op14eb04DonquixoteRosinanteOp12108108: CharacterCard = {
  id: "OP12-108",
  canonicalId: "OP12-108",
  slug: "donquixote-rosinante-op12-108",
  name: "Donquixote Rosinante - OP12-108",
  printings: [
    {
      id: "OP12-108",
      artId: "OP12-108",
      setCode: "OP14EB04",
      collectorNumber: "108",
      rarity: "TR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-108_upbOn8S.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "TR",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Trafalgar Law] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                filter: "name",
                value: "Trafalgar Law",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op14eb04DonquixoteRosinanteOp12108108I18n,
};
