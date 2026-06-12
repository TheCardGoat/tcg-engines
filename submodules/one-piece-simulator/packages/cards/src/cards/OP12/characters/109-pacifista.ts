import type { CharacterCard } from "@tcg/op-types";
import { op12Pacifista109I18n } from "./109-pacifista.i18n.ts";

export const op12Pacifista109: CharacterCard = {
  id: "OP12-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "K.O. up to 1 of your opponent's Characters with a cost of 1 or less and add this card to your hand.",
  traits: ["Biological Weapon Navy Egghead"],
  attribute: "special",
  effect:
    "[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 1 or less and add this card to your hand.",
  i18n: op12Pacifista109I18n,
};
