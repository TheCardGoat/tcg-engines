import type { CharacterCard } from "@tcg/op-types";
import { op07Lucy112I18n } from "./112-lucy.i18n.ts";

export const op07Lucy112: CharacterCard = {
  id: "OP07-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP07",
  cost: 6,
  power: 7000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    "[When Attacking] [Once Per Turn] You may add 1 card from the top or bottom of your Life cards to your hand: You may rest up to 1 of your opponent's Characters with a cost of 4 or less. Then, if you have 1 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07Lucy112I18n,
};
