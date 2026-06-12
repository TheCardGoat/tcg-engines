import type { CharacterCard } from "@tcg/op-types";
import { eb02MyskinaOlga053I18n } from "./053-myskina-olga.i18n.ts";

export const eb02MyskinaOlga053: CharacterCard = {
  id: "EB02-053",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Alchemi"],
  attribute: "wisdom",
  effect:
    "[On Play]/[On K.O.] Look at up to 1 card from the top of your or your opponent's Life cards and place it at the top or bottom of the Life cards.",
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
      {
        trigger: "onKo",
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
  i18n: eb02MyskinaOlga053I18n,
};
