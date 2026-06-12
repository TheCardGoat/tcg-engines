import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteKatakuri063I18n } from "./063-charlotte-katakuri.i18n.ts";

export const op08CharlotteKatakuri063: CharacterCard = {
  id: "OP08-063",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP08",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[On Play] You may turn 1 card from the top of your Life cards face-down: Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08CharlotteKatakuri063I18n,
};
