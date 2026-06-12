import type { CharacterCard } from "@tcg/op-types";
import { op11Vito042I18n } from "./042-vito.i18n.ts";

export const op11Vito042: CharacterCard = {
  id: "OP11-042",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Firetank Pirates"],
  attribute: "ranged",
  effect:
    '[On Play] You may trash 1 "Firetank Pirates" type card from your hand: This Character gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
        optional: true,
      },
    ],
  },
  i18n: op11Vito042I18n,
};
