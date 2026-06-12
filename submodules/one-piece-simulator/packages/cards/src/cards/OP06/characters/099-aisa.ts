import type { CharacterCard } from "@tcg/op-types";
import { op06Aisa099I18n } from "./099-aisa.i18n.ts";

export const op06Aisa099: CharacterCard = {
  id: "OP06-099",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at up to 1 card from the top of your or your opponent's Life cards and place it at the top or bottom of the Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: op06Aisa099I18n,
};
