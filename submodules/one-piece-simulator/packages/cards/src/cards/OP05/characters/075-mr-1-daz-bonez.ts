import type { CharacterCard } from "@tcg/op-types";
import { op05Mr1DazBonez075I18n } from "./075-mr-1-daz-bonez.i18n.ts";

export const op05Mr1DazBonez075: CharacterCard = {
  id: "OP05-075",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    "[On Your Opponent's Attack][Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Baroque Works] type Character card with a cost of 3 or less from your hand.",
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
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Baroque Works",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Mr1DazBonez075I18n,
};
