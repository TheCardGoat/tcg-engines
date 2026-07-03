import type { CharacterCard } from "@tcg/op-types";
import { op04MissGoldenweekMarianne065I18n } from "./065-miss-goldenweek-marianne.i18n.ts";

export const op04MissGoldenweekMarianne065: CharacterCard = {
  id: "OP04-065",
  canonicalId: "OP04-065",
  slug: "miss-goldenweek-marianne/op04-065",
  name: "Miss.Goldenweek(Marianne)",
  printings: [
    {
      id: "OP04-065",
      artId: "OP04-065",
      setCode: "OP04",
      collectorNumber: "065",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-065.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader's type includes \"Baroque Works\", up to 1 of your opponent's Characters with a cost of 5 or less cannot attack until the start of your next turn. [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        actions: [
          {
            action: "cannotAttack",
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
                  value: 5,
                },
              ],
            },
            duration: "untilStartOfNextTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op04MissGoldenweekMarianne065I18n,
};
