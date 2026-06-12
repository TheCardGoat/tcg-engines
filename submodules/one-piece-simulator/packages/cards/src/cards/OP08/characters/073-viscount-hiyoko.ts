import type { CharacterCard } from "@tcg/op-types";
import { op08ViscountHiyoko073I18n } from "./073-viscount-hiyoko.i18n.ts";

export const op08ViscountHiyoko073: CharacterCard = {
  id: "OP08-073",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Opponent's Turn] [On K.O.] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Count Niwatori] with a cost of 6 or less from your deck. Then, shuffle your deck.",
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
                value: 6,
              },
              {
                filter: "name",
                value: "Count Niwatori",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op08ViscountHiyoko073I18n,
};
