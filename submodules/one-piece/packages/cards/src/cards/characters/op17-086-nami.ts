import type { CharacterCard } from "@tcg/op-types";
import { op17Nami086I18n } from "./op17-086-nami.i18n.ts";

export const op17Nami086: CharacterCard = {
  id: "OP17-086",
  canonicalId: "OP17-086",
  slug: "nami/op17-086",
  name: "Nami",
  printings: [
    {
      id: "OP17-086",
      artId: "OP17-086",
      setCode: "OP17",
      collectorNumber: "086",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-086_9eAWPvO.jpg",
      label: "Nami (086)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP17",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Elbaph Straw Hat Crew"],
  attribute: "special",
  effect: "[On Play] You may trash 1 {Elbaph} type card from your hand: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Elbaph",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17Nami086I18n,
};
