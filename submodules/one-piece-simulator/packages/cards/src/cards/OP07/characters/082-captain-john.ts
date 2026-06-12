import type { CharacterCard } from "@tcg/op-types";
import { op07CaptainJohn082I18n } from "./082-captain-john.i18n.ts";

export const op07CaptainJohn082: CharacterCard = {
  id: "OP07-082",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Thriller Bark Pirates Former Rocks Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Trash 2 cards from the top of your deck and give up to 1 of your opponent's Characters -1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07CaptainJohn082I18n,
};
