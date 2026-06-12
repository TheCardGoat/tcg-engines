import type { CharacterCard } from "@tcg/op-types";
import { op03UsoppSPirateCrew042I18n } from "./042-usopp-s-pirate-crew.i18n.ts";

export const op03UsoppSPirateCrew042: CharacterCard = {
  id: "OP03-042",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect: "[On Play] Add up to 1 blue [Usopp from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "blue",
                },
                {
                  filter: "name",
                  value: "Usopp",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03UsoppSPirateCrew042I18n,
};
