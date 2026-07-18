import type { CharacterCard } from "@tcg/op-types";
import { op10KinEmon026I18n } from "./026-kin-emon.i18n.ts";

export const op10KinEmon026: CharacterCard = {
  id: "OP10-026",
  canonicalId: "OP10-026",
  slug: "kin-emon/op10-026",
  name: "Kin'emon",
  printings: [
    {
      id: "OP10-026",
      artId: "OP10-026",
      setCode: "OP10",
      collectorNumber: "026",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-026.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine Punk Hazard"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may place this Character and 1 [Kin'emon] with 0 power from your trash at the bottom of your deck in any order: Play up to 1 [Kin'emon] with a cost of 6 from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToDeck",
            position: "bottom",
          },
          {
            cost: "returnTrashToDeck",
            amount: 1,
            position: "bottom",
            filters: [
              {
                filter: "name",
                value: "Kin'emon",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 0,
              },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 6,
              },
              {
                filter: "name",
                value: "Kin'emon",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10KinEmon026I18n,
};
