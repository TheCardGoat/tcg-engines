import type { CharacterCard } from "@tcg/op-types";
import { prb02ShachiPenguinPirateFoil008I18n } from "./st10-008-shachi-penguin-pirate-foil.i18n.ts";

export const prb02ShachiPenguinPirateFoil008: CharacterCard = {
  id: "ST10-008",
  canonicalId: "ST10-008",
  slug: "shachi-penguin-pirate-foil",
  name: "Shachi & Penguin",
  printings: [
    {
      id: "ST10-008",
      artId: "ST10-008",
      setCode: "ST10",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-008_p3.jpg",
      label: "Shachi & Penguin (Pirate Foil)",
    },
    {
      id: "ST10-008_r1",
      artId: "ST10-008_r1",
      setCode: "ST10",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-008_r1.jpg",
      label: "Shachi & Penguin (Reprint)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST10",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Heart Pirates"],
  attribute: "ranged",
  effect:
    "[On Play] If you have 3 or less DON!! cards on your field, add up to 2 DON!! cards from your DON!! deck and rest them.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 2,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: prb02ShachiPenguinPirateFoil008I18n,
};
