import type { CharacterCard } from "@tcg/op-types";
import { op09DonquixoteRosinanteSp119I18n } from "./119-donquixote-rosinante-sp.i18n.ts";

export const op09DonquixoteRosinanteSp119: CharacterCard = {
  id: "OP04-119",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP09",
  cost: 8,
  power: 8000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  effect:
    "[Opponent's Turn] If this Character is rested, your active Characters with a base cost of 5 cannot be K.O.'d by effects.\n[On Play] You may rest this Character: Play up to 1 green Character card with a cost of 5 from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restThisCard",
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
                value: 5,
              },
              {
                filter: "color",
                value: "green",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "state",
                  value: "active",
                },
                {
                  filter: "baseCost",
                  comparison: "eq",
                  value: 5,
                },
              ],
            },
            duration: "permanent",
            restriction: "byEffect",
          },
        ],
      },
    ],
  },
  i18n: op09DonquixoteRosinanteSp119I18n,
};
