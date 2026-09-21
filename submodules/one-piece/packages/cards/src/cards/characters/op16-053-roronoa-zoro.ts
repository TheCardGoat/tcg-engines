import type { CharacterCard } from "@tcg/op-types";
import { op16RoronoaZoro053I18n } from "./op16-053-roronoa-zoro.i18n.ts";

export const op16RoronoaZoro053: CharacterCard = {
  id: "OP16-053",
  canonicalId: "OP16-053",
  slug: "roronoa-zoro/op16-053",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP16-053",
      artId: "OP16-053",
      setCode: "OP16",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-053_Z44W9PE.jpg",
      label: "Roronoa Zoro (053)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP16",
  cost: 7,
  power: 9000,
  traits: ["Straw Hat Crew Supernovas Dressrosa"],
  attribute: "slash",
  effect: "[When Attacking] If you have 6 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op16RoronoaZoro053I18n,
};
