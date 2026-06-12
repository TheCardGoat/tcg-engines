import type { CharacterCard } from "@tcg/op-types";
import { op13Bepo035I18n } from "./035-bepo.i18n.ts";

export const op13Bepo035: CharacterCard = {
  id: "OP13-035",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 5,
  power: 7000,
  traits: ["FILM Heart Pirates Minks"],
  attribute: "strike",
  effect: "[End of Your Turn] Set this Character or up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13Bepo035I18n,
};
