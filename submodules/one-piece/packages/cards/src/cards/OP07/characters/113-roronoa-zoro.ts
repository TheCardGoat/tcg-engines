import type { CharacterCard } from "@tcg/op-types";
import { op07RoronoaZoro113I18n } from "./113-roronoa-zoro.i18n.ts";

export const op07RoronoaZoro113: CharacterCard = {
  id: "OP07-113",
  canonicalId: "OP07-113",
  slug: "roronoa-zoro/op07-113",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP07-113",
      artId: "OP07-113",
      setCode: "OP07",
      collectorNumber: "113",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    "If your Leader has the [Egghead] type, rest up to 1 of your opponent's Leader or Character cards.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "slash",
  effect:
    "[Trigger] If your Leader has the [Egghead] type, rest up to 1 of your opponent's Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Egghead",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
  i18n: op07RoronoaZoro113I18n,
};
