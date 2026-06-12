import type { CharacterCard } from "@tcg/op-types";
import { op08CountNiwatori071I18n } from "./071-count-niwatori.i18n.ts";

export const op08CountNiwatori071: CharacterCard = {
  id: "OP08-071",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Opponent's Turn] [On K.O.] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Baron Tamago] with a cost of 4 or less from your deck. Then, shuffle your deck.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
            action: "play",
            source: {
              player: "self",
              zone: "deck",
            },
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
              {
                filter: "name",
                value: "Baron Tamago",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op08CountNiwatori071I18n,
};
