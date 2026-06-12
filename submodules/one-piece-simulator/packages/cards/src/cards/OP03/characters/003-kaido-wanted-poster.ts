import type { CharacterCard } from "@tcg/op-types";
import { op03KaidoWantedPoster003I18n } from "./003-kaido-wanted-poster.i18n.ts";

export const op03KaidoWantedPoster003: CharacterCard = {
  id: "ST04-003",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP03",
  cost: 9,
  power: 10000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",
  effect:
    "[On Play] DON!! -5 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 6 or less. This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 5,
          },
        ],
        actions: [
          {
            action: "ko",
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
                  value: 6,
                },
              ],
            },
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op03KaidoWantedPoster003I18n,
};
