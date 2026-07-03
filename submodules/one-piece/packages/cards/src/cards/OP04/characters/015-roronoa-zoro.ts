import type { CharacterCard } from "@tcg/op-types";
import { op04RoronoaZoro015I18n } from "./015-roronoa-zoro.i18n.ts";

export const op04RoronoaZoro015: CharacterCard = {
  id: "OP04-015",
  canonicalId: "OP04-015",
  slug: "roronoa-zoro/op04-015",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP04-015",
      artId: "OP04-015",
      setCode: "OP04",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-015.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "slash",
  effect: "[On Play] Give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op04RoronoaZoro015I18n,
};
