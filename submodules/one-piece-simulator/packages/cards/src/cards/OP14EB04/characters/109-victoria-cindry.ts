import type { CharacterCard } from "@tcg/op-types";
import { op14eb04VictoriaCindry109I18n } from "./109-victoria-cindry.i18n.ts";

export const op14eb04VictoriaCindry109: CharacterCard = {
  id: "OP14-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 1000,
  counter: 1000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  effect: "[Blocker]",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op14eb04VictoriaCindry109I18n,
};
