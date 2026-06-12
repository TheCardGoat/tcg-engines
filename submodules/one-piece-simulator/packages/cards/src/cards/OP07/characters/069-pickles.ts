import type { CharacterCard } from "@tcg/op-types";
import { op07Pickles069I18n } from "./069-pickles.i18n.ts";

export const op07Pickles069: CharacterCard = {
  id: "OP07-069",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Foxy Pirates"],
  attribute: "strike",
  effect:
    "If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, your [Foxy Pirates] type Characters other than [Pickles] cannot be K.O.'d by your opponent's effects.",
  i18n: op07Pickles069I18n,
};
