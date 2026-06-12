import type { CharacterCard } from "@tcg/op-types";
import { eb02Buggy018I18n } from "./018-buggy.i18n.ts";

export const eb02Buggy018: CharacterCard = {
  id: "EB02-018",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB02",
  cost: 4,
  power: 6000,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Buggy Pirates East Blue"],
  attribute: "slash",
  effect:
    "[On Play] If you have no other [Buggy] Characters, up to 1 of your Leader gains [Double Attack] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "name",
                value: "Buggy",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb02Buggy018I18n,
};
