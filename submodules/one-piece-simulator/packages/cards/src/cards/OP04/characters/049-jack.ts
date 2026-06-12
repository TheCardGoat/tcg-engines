import type { CharacterCard } from "@tcg/op-types";
import { op04Jack049I18n } from "./049-jack.i18n.ts";

export const op04Jack049: CharacterCard = {
  id: "OP04-049",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP04",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect: "[On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
  i18n: op04Jack049I18n,
};
