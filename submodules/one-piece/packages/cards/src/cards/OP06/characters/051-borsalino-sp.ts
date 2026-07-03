import type { CharacterCard } from "@tcg/op-types";
import { op06BorsalinoSp051I18n } from "./051-borsalino-sp.i18n.ts";

export const op06BorsalinoSp051: CharacterCard = {
  id: "OP05-051",
  canonicalId: "OP05-051",
  slug: "borsalino-sp",
  name: "Borsalino (SP)",
  printings: [
    {
      id: "OP05-051",
      artId: "OP05-051",
      setCode: "OP06",
      collectorNumber: "051",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-051_p2.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP06",
  cost: 7,
  power: 8000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06BorsalinoSp051I18n,
};
