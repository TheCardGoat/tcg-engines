import type { EventCard } from "@tcg/op-types";
import { op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037I18n } from "./037-because-the-side-of-justice-will-be-whichever-side-wins.i18n.ts";

export const op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037: EventCard = {
  id: "OP05-037",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP05",
  cost: 0,
  traits: ["Donquixote Pirates"],
  effect:
    "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle. [Trigger] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
        ],
      },
    ],
  },
  i18n: op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037I18n,
};
