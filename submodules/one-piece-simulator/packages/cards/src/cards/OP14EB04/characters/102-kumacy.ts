import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Kumacy102I18n } from "./102-kumacy.i18n.ts";

export const op14eb04Kumacy102: CharacterCard = {
  id: "OP14-102",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 2000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "strike",
  effect:
    "[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  i18n: op14eb04Kumacy102I18n,
};
