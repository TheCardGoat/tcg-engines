import type { CharacterCard } from "@tcg/op-types";
import { eb01Scarlet042I18n } from "./042-scarlet.i18n.ts";

export const eb01Scarlet042: CharacterCard = {
  id: "EB01-042",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB01",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash this Character: Play up to 1 [Dressrosa] type Character card with a cost of 3 or less other than [Scarlet] from your hand rested. Then, give up to 1 of your opponent's Characters -2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
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
                value: "Scarlet",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Dressrosa",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01Scarlet042I18n,
};
