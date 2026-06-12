import type { CharacterCard } from "@tcg/op-types";
import { op13Gordon024I18n } from "./024-gordon.i18n.ts";

export const op13Gordon024: CharacterCard = {
  id: "OP13-024",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["FILM"],
  attribute: "wisdom",
  effect:
    '[On Play] You may reveal 1 "Music" or "FILM" type card from your hand: Set up to 2 of your DON!! cards as active at the end of this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13Gordon024I18n,
};
