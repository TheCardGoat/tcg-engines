import type { CharacterCard } from "@tcg/op-types";
import { prb02AdioPirateFoil078I18n } from "./p-078-adio-pirate-foil.i18n.ts";

export const prb02AdioPirateFoil078: CharacterCard = {
  id: "P-078",
  canonicalId: "P-078",
  slug: "adio-pirate-foil",
  name: "Adio",
  printings: [
    {
      id: "P-078",
      artId: "P-078",
      setCode: "P",
      collectorNumber: "078",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-078_p6.jpg",
      label: "Adio (Pirate Foil)",
    },
    {
      id: "P-078_r1",
      artId: "P-078_r1",
      setCode: "P",
      collectorNumber: "078",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-078_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["ODYSSEY"],
  attribute: "ranged",
  effect:
    'If you have 2 or more rested "ODYSSEY" type Characters, this Character gains +1000 power.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
              {
                filter: "trait",
                value: "ODYSSEY",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb02AdioPirateFoil078I18n,
};
