import type { CharacterCard } from "@tcg/op-types";
import { op08SBear113I18n } from "./113-s-bear.i18n.ts";

export const op08SBear113: CharacterCard = {
  id: "OP08-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger:
    "You may trash 1 card from your hand: If you have 2 or less Life cards, play this card and K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  traits: ["Egghead Seraphim"],
  attribute: "special",
  effect:
    "[Trigger] You may trash 1 card from your hand: If you have 2 or less Life cards, play this card and K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  i18n: op08SBear113I18n,
};
