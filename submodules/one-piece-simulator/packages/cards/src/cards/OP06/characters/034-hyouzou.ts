import type { CharacterCard } from "@tcg/op-types";
import { op06Hyouzou034I18n } from "./034-hyouzou.i18n.ts";

export const op06Hyouzou034: CharacterCard = {
  id: "OP06-034",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 6000,
  traits: ["Fish-Man"],
  attribute: "slash",
  effect:
    "[Activate:Main][Once Per Turn] Rest up to 1 of your opponent's Characters with a cost of 4 or less and this Character gains +1000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "rest",
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
                  value: 4,
                },
              ],
            },
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Hyouzou034I18n,
};
