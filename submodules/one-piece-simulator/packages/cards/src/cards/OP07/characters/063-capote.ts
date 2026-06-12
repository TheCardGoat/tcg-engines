import type { CharacterCard } from "@tcg/op-types";
import { op07Capote063I18n } from "./063-capote.i18n.ts";

export const op07Capote063: CharacterCard = {
  id: "OP07-063",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man Foxy Pirates"],
  attribute: "strike",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Foxy Pirates] type, up to 1 of your opponent's Characters with a cost of 6 or less cannot attack until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Foxy Pirates",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotAttack",
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
                  value: 6,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op07Capote063I18n,
};
