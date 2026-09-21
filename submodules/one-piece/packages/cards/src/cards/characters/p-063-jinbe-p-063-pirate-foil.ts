import type { CharacterCard } from "@tcg/op-types";
import { prb02JinbeP063PirateFoil063I18n } from "./p-063-jinbe-p-063-pirate-foil.i18n.ts";

export const prb02JinbeP063PirateFoil063: CharacterCard = {
  id: "P-063",
  canonicalId: "P-063",
  slug: "jinbe-p-063-pirate-foil",
  name: "Jinbe",
  printings: [
    {
      id: "P-063",
      artId: "P-063",
      setCode: "P",
      collectorNumber: "063",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-063_p1_rWUDzZS.jpg",
      label: "Jinbe - P-063 (Pirate Foil)",
    },
    {
      id: "P-063_r1",
      artId: "P-063_r1",
      setCode: "P",
      collectorNumber: "063",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-063_r1.jpg",
      label: "Jinbe - P-063 (Reprint)",
    },
    {
      id: "P-063_p1",
      artId: "P-063_p1",
      setCode: "P",
      collectorNumber: "063",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-063_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Fish-Man"],
  attribute: "strike",
  effect: "[On Play] Rest up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02JinbeP063PirateFoil063I18n,
};
