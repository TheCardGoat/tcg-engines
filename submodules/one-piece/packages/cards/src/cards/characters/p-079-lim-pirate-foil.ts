import type { CharacterCard } from "@tcg/op-types";
import { prb02LimPirateFoil079I18n } from "./p-079-lim-pirate-foil.i18n.ts";

export const prb02LimPirateFoil079: CharacterCard = {
  id: "P-079",
  canonicalId: "P-079",
  slug: "lim-pirate-foil",
  name: "Lim",
  printings: [
    {
      id: "P-079",
      artId: "P-079",
      setCode: "P",
      collectorNumber: "079",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-079_p3.jpg",
      label: "Lim (Pirate Foil)",
    },
    {
      id: "P-079_r1",
      artId: "P-079_r1",
      setCode: "P",
      collectorNumber: "079",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-079_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[End of Your Turn] If you have 2 or more rested "ODYSSEY" type Characters, set this Character as active.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
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
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: prb02LimPirateFoil079I18n,
};
