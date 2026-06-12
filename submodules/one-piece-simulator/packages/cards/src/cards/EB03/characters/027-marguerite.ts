import type { CharacterCard } from "@tcg/op-types";
import { eb03Marguerite027I18n } from "./027-marguerite.i18n.ts";

export const eb03Marguerite027: CharacterCard = {
  id: "EB03-027",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB03",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect: "[On Play] Return up to 1 Character with 7000 base power to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "eq",
                  value: 7000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb03Marguerite027I18n,
};
