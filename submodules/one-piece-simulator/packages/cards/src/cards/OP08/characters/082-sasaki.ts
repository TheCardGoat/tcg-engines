import type { CharacterCard } from "@tcg/op-types";
import { op08Sasaki082I18n } from "./082-sasaki.i18n.ts";

export const op08Sasaki082: CharacterCard = {
  id: "OP08-082",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] Rest 1 of your DON!! cards and you may rest this Character: Give up to 1 of your opponent's Characters 2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "rest",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op08Sasaki082I18n,
};
