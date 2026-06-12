import type { CharacterCard } from "@tcg/op-types";
import { op07VinsmokeSanji061I18n } from "./061-vinsmoke-sanji.i18n.ts";

export const op07VinsmokeSanji061: CharacterCard = {
  id: "OP07-061",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "strike",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [The Vinsmoke Family] type, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Vinsmoke Family",
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
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op07VinsmokeSanji061I18n,
};
