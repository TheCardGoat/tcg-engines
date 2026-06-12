import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Chew050I18n } from "./050-chew.i18n.ts";

export const op14eb04Chew050: CharacterCard = {
  id: "OP14-050",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  power: 3000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "ranged",
  effect: "[On Play] If your Leader has the {Fish-Man} type, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Fish-Man",
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
  i18n: op14eb04Chew050I18n,
};
