import type { CharacterCard } from "@tcg/op-types";
import { op06Arlong023I18n } from "./023-arlong.i18n.ts";

export const op06Arlong023: CharacterCard = {
  id: "OP06-023",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 6000,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: Up to 1 of your opponent's rested Leader cannot attack until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06Arlong023I18n,
};
