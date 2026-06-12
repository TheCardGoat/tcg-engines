import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Mystoms017I18n } from "./017-mystoms.i18n.ts";

export const op14eb04Mystoms017: CharacterCard = {
  id: "EB04-017",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 6,
  power: 5000,
  counter: 1000,
  traits: ["Minks Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Your Turn] If you have 3 or more {Minks} type Characters, give all of your opponent's Characters 1 cost.\n[On Play] If your Leader has the {Minks} type, play up to 1 {Minks} type Character card with a cost of 5 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Minks",
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
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Minks",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
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
            comparison: "gte",
            value: 3,
            filters: [
              {
                filter: "trait",
                value: "Minks",
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
            value: 1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Mystoms017I18n,
};
