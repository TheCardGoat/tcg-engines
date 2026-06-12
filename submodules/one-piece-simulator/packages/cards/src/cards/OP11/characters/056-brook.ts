import type { CharacterCard } from "@tcg/op-types";
import { op11Brook056I18n } from "./056-brook.i18n.ts";

export const op11Brook056: CharacterCard = {
  id: "OP11-056",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Place up to 1 Character with a base cost of 1 at the bottom of the owner's deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op11Brook056I18n,
};
