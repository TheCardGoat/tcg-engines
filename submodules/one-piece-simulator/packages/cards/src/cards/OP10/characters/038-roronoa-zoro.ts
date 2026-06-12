import type { CharacterCard } from "@tcg/op-types";
import { op10RoronoaZoro038I18n } from "./038-roronoa-zoro.i18n.ts";

export const op10RoronoaZoro038: CharacterCard = {
  id: "OP10-038",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas ODYSSEY"],
  attribute: "slash",
  effect:
    "[Opponent's Turn] If you have 2 or more rested Characters, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10RoronoaZoro038I18n,
};
