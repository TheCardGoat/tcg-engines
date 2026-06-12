import type { CharacterCard } from "@tcg/op-types";
import { op12Kalgara099I18n } from "./099-kalgara.i18n.ts";

export const op12Kalgara099: CharacterCard = {
  id: "OP12-099",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior Jaya"],
  attribute: "slash",
  effect:
    "[Your Turn] When a card is removed from your or your opponent's Life cards, draw 1 card. Then, you cannot draw cards using your own effects during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenLifeRemoved",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
  i18n: op12Kalgara099I18n,
};
