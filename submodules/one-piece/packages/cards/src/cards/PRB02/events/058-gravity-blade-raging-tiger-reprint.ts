import type { EventCard } from "@tcg/op-types";
import { prb02GravityBladeRagingTigerReprint058I18n } from "./058-gravity-blade-raging-tiger-reprint.i18n.ts";

export const prb02GravityBladeRagingTigerReprint058: EventCard = {
  id: "OP06-058",
  canonicalId: "OP06-058",
  slug: "gravity-blade-raging-tiger-reprint",
  name: "Gravity Blade Raging Tiger (Reprint)",
  printings: [
    {
      id: "OP06-058",
      artId: "OP06-058",
      setCode: "PRB02",
      collectorNumber: "058",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-058_r1.jpg",
    },
    {
      id: "OP06-058_p1",
      artId: "OP06-058_p1",
      setCode: "PRB02",
      collectorNumber: "058",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-058_p1.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 7,
  traits: ["Navy"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-058_p1.jpg",
      imageId: "OP06-058_p1",
    },
  ],
  effect:
    "[Main] Place up to 2 Characters with a cost of 6 or less at the bottom of the owner's deck in any order.[Trigger] Place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
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
  i18n: prb02GravityBladeRagingTigerReprint058I18n,
};
