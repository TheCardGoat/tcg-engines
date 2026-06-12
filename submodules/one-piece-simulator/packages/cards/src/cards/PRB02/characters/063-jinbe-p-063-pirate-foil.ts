import type { CharacterCard } from "@tcg/op-types";
import { prb02JinbeP063PirateFoil063I18n } from "./063-jinbe-p-063-pirate-foil.i18n.ts";

export const prb02JinbeP063PirateFoil063: CharacterCard = {
  id: "P-063",
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Fish-Man"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-063_r1.jpg",
      imageId: "P-063_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-063_p1.jpg",
      imageId: "P-063_p1",
    },
  ],
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
