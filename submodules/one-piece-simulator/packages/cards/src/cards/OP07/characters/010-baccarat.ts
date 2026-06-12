import type { CharacterCard } from "@tcg/op-types";
import { op07Baccarat010I18n } from "./010-baccarat.i18n.ts";

export const op07Baccarat010: CharacterCard = {
  id: "OP07-010",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Grantesoro"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Your Opponent's Attack][Once Per Turn] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07Baccarat010I18n,
};
