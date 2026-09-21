import type { CharacterCard } from "@tcg/op-types";
import { op17Brook091I18n } from "./op17-091-brook.i18n.ts";

export const op17Brook091: CharacterCard = {
  id: "OP17-091",
  canonicalId: "OP17-091",
  slug: "brook/op17-091",
  name: "Brook",
  printings: [
    {
      id: "OP17-091",
      artId: "OP17-091",
      setCode: "OP17",
      collectorNumber: "091",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-091_oDw2KRk.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Elbaph Straw Hat Crew"],
  attribute: "slash",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains +3000 power.\n[On Play] If there is a Character with a cost of 12 or more, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17Brook091I18n,
};
