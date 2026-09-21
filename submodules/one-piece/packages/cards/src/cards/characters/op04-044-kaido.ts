import type { CharacterCard } from "@tcg/op-types";
import { op04Kaido044I18n } from "./op04-044-kaido.i18n.ts";

export const op04Kaido044: CharacterCard = {
  id: "OP04-044",
  canonicalId: "OP04-044",
  slug: "kaido/op04-044",
  name: "Kaido",
  printings: [
    {
      id: "OP04-044",
      artId: "OP04-044",
      setCode: "OP04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044.jpg",
    },
    {
      id: "OP04-044_p1",
      artId: "OP04-044_p1",
      setCode: "OP04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p1.jpg",
    },
    {
      id: "OP04-044_p2",
      artId: "OP04-044_p2",
      setCode: "OP04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p2.jpg",
      label: "Kaido (044) (SP)",
    },
    {
      id: "OP04-044_p4",
      artId: "OP04-044_p4",
      setCode: "OP04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p4.jpg",
      label: "Kaido (OP04-044) (Alternate Art)",
    },
    {
      id: "OP04-044_r1",
      artId: "OP04-044_r1",
      setCode: "OP04",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP04",
  cost: 10,
  power: 12000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",

  effect:
    "[On Play] Return up to 1 Character with a cost of 8 or less and up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
          },
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Kaido044I18n,
};
