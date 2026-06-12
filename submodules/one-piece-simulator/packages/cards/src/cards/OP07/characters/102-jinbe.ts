import type { CharacterCard } from "@tcg/op-types";
import { op07Jinbe102I18n } from "./102-jinbe.i18n.ts";

export const op07Jinbe102: CharacterCard = {
  id: "OP07-102",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    "Return up to 1 of your opponent's Characters with a cost of 4 or less to the owner's hand and add this card to your hand.",
  traits: ["Fish-Man Straw Hat Crew Egghead"],
  attribute: "strike",
  effect:
    "[Trigger] Return up to 1 of your opponent's Characters with a cost of 4 or less to the owner's hand and add this card to your hand.",
  i18n: op07Jinbe102I18n,
};
