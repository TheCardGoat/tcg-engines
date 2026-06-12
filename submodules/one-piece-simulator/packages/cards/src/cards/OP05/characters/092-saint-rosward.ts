import type { CharacterCard } from "@tcg/op-types";
import { op05SaintRosward092I18n } from "./092-saint-rosward.i18n.ts";

export const op05SaintRosward092: CharacterCard = {
  id: "OP05-092",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 5,
  power: 0,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "ranged",
  effect:
    "[Your Turn] If the only Characters on your field are [Celestial Dragons] type Characters, give all of your opponent's Characters -6 cost.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "eq",
            value: 0,
            filters: [
              {
                filter: "trait",
                value: "Celestial Dragons",
                negate: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -6,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op05SaintRosward092I18n,
};
