import type { CharacterCard } from "@tcg/op-types";
import { op10KinEmon027I18n } from "./027-kin-emon.i18n.ts";

export const op10KinEmon027: CharacterCard = {
  id: "OP10-027",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano The Akazaya Nine Punk Hazard"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may place this Character and 1 [Kin'emon] with 1000 power from your trash at the bottom of your deck in any order: Play up to 1 [Kin'emon] with a cost of 6 from your hand.",
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
  i18n: op10KinEmon027I18n,
};
