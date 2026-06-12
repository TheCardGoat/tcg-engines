import type { CharacterCard } from "@tcg/op-types";
import { op02Dogura010I18n } from "./010-dogura.i18n.ts";

export const op02Dogura010: CharacterCard = {
  id: "OP02-010",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Mountain Bandits"],
  attribute: "slash",
  effect:
    "[Activate:Main] You may rest this Character: Play up to 1 red Character other than [Dogura] with a cost of 1 from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                filter: "excludeName",
                value: "Dogura",
              },
              {
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "color",
                value: "red",
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
  },
  i18n: op02Dogura010I18n,
};
