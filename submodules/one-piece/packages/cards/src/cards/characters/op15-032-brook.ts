import type { CharacterCard } from "@tcg/op-types";
import { op15Brook032I18n } from "./op15-032-brook.i18n.ts";

export const op15Brook032: CharacterCard = {
  id: "OP15-032",
  canonicalId: "OP15-032",
  slug: "brook/op15-032",
  name: "Brook",
  printings: [
    {
      id: "OP15-032",
      artId: "OP15-032",
      setCode: "OP15",
      collectorNumber: "032",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-032_UuYezw2.jpg",
      label: "Brook (OP15-032)",
    },
    {
      id: "OP15-032_p1",
      artId: "OP15-032_p1",
      setCode: "OP15",
      collectorNumber: "032",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-032_p1_LgM6irK.jpg",
      label: "Brook (OP15-032) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP15",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[On Play] Rest up to 1 of your opponent's cards.\n[Activate: Main] You may trash this Character: If your Leader has the {Straw Hat Crew} type, set up to 1 of your Characters with a base cost of 8 or less as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
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
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "Straw Hat Crew",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op15Brook032I18n,
};
