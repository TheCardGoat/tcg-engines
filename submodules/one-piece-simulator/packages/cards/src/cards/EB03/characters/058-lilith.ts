import type { CharacterCard } from "@tcg/op-types";
import { eb03Lilith058I18n } from "./058-lilith.i18n.ts";

export const eb03Lilith058: CharacterCard = {
  id: "EB03-058",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger: "If your Leader is [Vegapunk], play this card.",
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect: "[Your Turn] [On Play] If you have 2 or less Life cards, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb03Lilith058I18n,
};
