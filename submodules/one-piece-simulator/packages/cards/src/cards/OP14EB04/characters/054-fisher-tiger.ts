import type { CharacterCard } from "@tcg/op-types";
import { op14eb04FisherTiger054I18n } from "./054-fisher-tiger.i18n.ts";

export const op14eb04FisherTiger054: CharacterCard = {
  id: "OP14-054",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 4,
  power: 7000,
  counter: 1000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the {Fish-Man} type, draw 3 cards.\n[End of Your Turn] Trash cards from your hand until you have 5 cards in your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Fish-Man",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 5,
          },
        ],
      },
    ],
  },
  i18n: op14eb04FisherTiger054I18n,
};
