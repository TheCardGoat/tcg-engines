import type { CharacterCard } from "@tcg/op-types";
import { eb02Vista027I18n } from "./027-vista.i18n.ts";

export const eb02Vista027: CharacterCard = {
  id: "EB02-027",
  canonicalId: "EB02-027",
  slug: "vista/eb02-027",
  name: "Vista",
  printings: [
    {
      id: "EB02-027",
      artId: "EB02-027",
      setCode: "EB02",
      collectorNumber: "027",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-027.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Place up to 1 of your opponent's Characters with 1000 power or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 1000,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb02Vista027I18n,
};
