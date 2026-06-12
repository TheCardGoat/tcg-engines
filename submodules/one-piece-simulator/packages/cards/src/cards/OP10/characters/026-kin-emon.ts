import type { CharacterCard } from "@tcg/op-types";
import { op10KinEmon026I18n } from "./026-kin-emon.i18n.ts";

export const op10KinEmon026: CharacterCard = {
  id: "OP10-026",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine Punk Hazard"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may place this Character and 1 [Kin'emon] with 0 power from your trash at the bottom of your deck in any order: Play up to 1 [Kin'emon] with a cost of 6 from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                value: 6,
              },
              {
                filter: "name",
                value: "Kin'emon",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10KinEmon026I18n,
};
