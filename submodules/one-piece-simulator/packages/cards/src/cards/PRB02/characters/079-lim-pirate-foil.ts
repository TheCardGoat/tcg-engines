import type { CharacterCard } from "@tcg/op-types";
import { prb02LimPirateFoil079I18n } from "./079-lim-pirate-foil.i18n.ts";

export const prb02LimPirateFoil079: CharacterCard = {
  id: "P-079",
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "PRB02",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-079_r1.jpg",
      imageId: "P-079_r1",
    },
  ],
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
