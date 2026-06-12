import type { CharacterCard } from "@tcg/op-types";
import { op04Yokozuna068I18n } from "./068-yokozuna.i18n.ts";

export const op04Yokozuna068: CharacterCard = {
  id: "OP04-068",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Animal Water Seven"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Return up to 1 of your opponent's Characters with a cost of 2 or less to the owner's hand.",
  effects: {
    keywords: ["blocker"],
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
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Yokozuna068I18n,
};
