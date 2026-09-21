import type { CharacterCard } from "@tcg/op-types";
import { op17JaguarDSaul089I18n } from "./op17-089-jaguar-d-saul.i18n.ts";

export const op17JaguarDSaul089: CharacterCard = {
  id: "OP17-089",
  canonicalId: "OP17-089",
  slug: "jaguar-d-saul/op17-089",
  name: "Jaguar.D.Saul",
  printings: [
    {
      id: "OP17-089",
      artId: "OP17-089",
      setCode: "OP17",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-089_C3MyMVa.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP17",
  cost: 4,
  power: 6000,
  traits: ["Giant Former Navy Elbaph"],
  attribute: "strike",
  effect:
    "This Character gains +12 cost.\n[On Play] Look at 3 cards from the top of your deck; reveal up to 1 {Elbaph} type card and add it to your hand. Then, trash the rest.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                value: "Elbaph",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 12,
          },
        ],
      },
    ],
  },
  i18n: op17JaguarDSaul089I18n,
};
