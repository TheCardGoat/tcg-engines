import type { CharacterCard } from "@tcg/op-types";
import { op07Spandam086I18n } from "./086-spandam.i18n.ts";

export const op07Spandam086: CharacterCard = {
  id: "OP07-086",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "slash",
  effect:
    "[On Play] Trash 2 cards from the top of your deck and give up to 1 of your opponent's Characters -2 cost during this turn.",
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
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07Spandam086I18n,
};
