import type { CharacterCard } from "@tcg/op-types";
import { op07Crocodile040I18n } from "./040-crocodile.i18n.ts";

export const op07Crocodile040: CharacterCard = {
  id: "OP07-040",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[On Play] (1) (You may rest the specified number of DON!! cards in your cost area.): Return up to 1 Character with a cost of 2 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
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
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07Crocodile040I18n,
};
