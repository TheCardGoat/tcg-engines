import type { CharacterCard } from "@tcg/op-types";
import { eb01Mr9037I18n } from "./037-mr-9.i18n.ts";

export const eb01Mr9037: CharacterCard = {
  id: "EB01-037",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "ko",
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
                  value: 2,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb01Mr9037I18n,
};
