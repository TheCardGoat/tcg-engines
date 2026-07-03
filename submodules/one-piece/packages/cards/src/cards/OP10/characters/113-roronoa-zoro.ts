import type { CharacterCard } from "@tcg/op-types";
import { op10RoronoaZoro113I18n } from "./113-roronoa-zoro.i18n.ts";

export const op10RoronoaZoro113: CharacterCard = {
  id: "OP10-113",
  canonicalId: "OP10-113",
  slug: "roronoa-zoro/op10-113",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP10-113",
      artId: "OP10-113",
      setCode: "OP10",
      collectorNumber: "113",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 5000,
  trigger:
    'You may trash 1 card from your hand: If your Leader has the "Supernovas" type, play this card.',
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect: "If you have less Life cards than your opponent, this Character gains [Rush].",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "lifeComparison",
            selfComparison: "lt",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10RoronoaZoro113I18n,
};
