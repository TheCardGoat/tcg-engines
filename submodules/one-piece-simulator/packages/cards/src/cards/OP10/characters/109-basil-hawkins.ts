import type { CharacterCard } from "@tcg/op-types";
import { op10BasilHawkins109I18n } from "./109-basil-hawkins.i18n.ts";

export const op10BasilHawkins109: CharacterCard = {
  id: "OP10-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  traits: ["Hawkins Pirates Supernovas"],
  attribute: "slash",
  effect: "[On K.O.] Trash up to 1 card from the top of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
      },
    ],
  },
  i18n: op10BasilHawkins109I18n,
};
