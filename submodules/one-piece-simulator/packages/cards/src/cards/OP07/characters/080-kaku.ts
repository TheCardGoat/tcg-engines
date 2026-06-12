import type { CharacterCard } from "@tcg/op-types";
import { op07Kaku080I18n } from "./080-kaku.i18n.ts";

export const op07Kaku080: CharacterCard = {
  id: "OP07-080",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["CP0"],
  attribute: "slash",
  effect:
    '[On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: Give up to 1 of your opponent\'s Characters -3 cost during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07Kaku080I18n,
};
