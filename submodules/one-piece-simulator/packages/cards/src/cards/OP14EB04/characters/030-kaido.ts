import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Kaido030I18n } from "./030-kaido.i18n.ts";

export const op14eb04Kaido030: CharacterCard = {
  id: "EB04-030",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 7,
  power: 9000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",
  effect:
    "If this Character would be K.O.'d, you may return 1 DON!! card from your field to your DON!! deck instead. [On Play] DON!! -2: If your Leader has the {Animal Kingdom Pirates} type, this Character gains Rush during this turn. Then, rest up to 1 of your opponent's Characters with a cost of 7 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Animal Kingdom Pirates",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
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
                  value: 7,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Kaido030I18n,
};
