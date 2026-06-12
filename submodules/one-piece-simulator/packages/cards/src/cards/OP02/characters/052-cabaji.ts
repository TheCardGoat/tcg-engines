import type { CharacterCard } from "@tcg/op-types";
import { op02Cabaji052I18n } from "./052-cabaji.i18n.ts";

export const op02Cabaji052: CharacterCard = {
  id: "OP02-052",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Buggy Pirates"],
  attribute: "slash",
  effect: "[On Play] If you have [Mohji], draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Mohji",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op02Cabaji052I18n,
};
