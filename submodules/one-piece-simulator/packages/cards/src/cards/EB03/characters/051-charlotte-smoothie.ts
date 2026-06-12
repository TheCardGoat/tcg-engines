import type { CharacterCard } from "@tcg/op-types";
import { eb03CharlotteSmoothie051I18n } from "./051-charlotte-smoothie.i18n.ts";

export const eb03CharlotteSmoothie051: CharacterCard = {
  id: "EB03-051",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB03",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] If you have a face-up Life card, K.O. up to 1 of your opponent's Characters with a cost of 2 or less. Then, turn all of your Life cards face-down.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "faceUpLife",
            player: "self",
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
                  value: 2,
                },
              ],
            },
          },
          {
            action: "turnLifeFaceDown",
            player: "self",
          },
        ],
      },
    ],
  },
  i18n: eb03CharlotteSmoothie051I18n,
};
