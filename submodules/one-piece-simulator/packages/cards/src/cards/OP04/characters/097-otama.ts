import type { CharacterCard } from "@tcg/op-types";
import { op04Otama097I18n } from "./097-otama.i18n.ts";

export const op04Otama097: CharacterCard = {
  id: "OP04-097",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "wisdom",
  effect:
    "[On Play] Add up to 1 of your opponent's [Animal] or [SMILE] type Characters with a cost of 3 or less to the top of your opponent's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
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
                  value: 3,
                },
                {
                  filter: "trait",
                  value: "Animal",
                },
                {
                  filter: "trait",
                  value: "SMILE",
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: op04Otama097I18n,
};
