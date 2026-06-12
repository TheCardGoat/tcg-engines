import type { CharacterCard } from "@tcg/op-types";
import { op09Killer064I18n } from "./064-killer.i18n.ts";

export const op09Killer064: CharacterCard = {
  id: "OP09-064",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  effect:
    '[On Play] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Set up to 1 of your "Kid Pirates" type Leader as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Kid Pirates",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09Killer064I18n,
};
