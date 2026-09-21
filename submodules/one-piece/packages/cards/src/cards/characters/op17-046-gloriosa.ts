import type { CharacterCard } from "@tcg/op-types";
import { op17Gloriosa046I18n } from "./op17-046-gloriosa.i18n.ts";

export const op17Gloriosa046: CharacterCard = {
  id: "OP17-046",
  canonicalId: "OP17-046",
  slug: "gloriosa/op17-046",
  name: "Gloriosa",
  printings: [
    {
      id: "OP17-046",
      artId: "OP17-046",
      setCode: "OP17",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-046_lp8fYOT.jpg",
    },
    {
      id: "OP17-046_p1",
      artId: "OP17-046_p1",
      setCode: "OP17",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-046_p1_PEPU2kF.jpg",
      label: "Gloriosa (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP17",
  cost: 4,
  power: 1000,
  traits: ["Amazon Lily Rocks Pirates"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
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
                  value: 5,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op17Gloriosa046I18n,
};
