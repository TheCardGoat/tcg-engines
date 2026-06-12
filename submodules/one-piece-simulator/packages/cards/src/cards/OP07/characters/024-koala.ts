import type { CharacterCard } from "@tcg/op-types";
import { op07Koala024I18n } from "./024-koala.i18n.ts";

export const op07Koala024: CharacterCard = {
  id: "OP07-024",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Foolshout Island"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] You may rest this Character: Up to 1 of your [Fish-Man] type Characters with a cost of 5 or less gains [Blocker] during this turn. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Fish-Man",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07Koala024I18n,
};
