import type { CharacterCard } from "@tcg/op-types";
import { op11Gotti050I18n } from "./050-gotti.i18n.ts";

export const op11Gotti050: CharacterCard = {
  id: "OP11-050",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Firetank Pirates"],
  attribute: "ranged",
  effect:
    '[When Attacking] You may trash 1 "Firetank Pirates" type card from your hand: Return up to 1 Character with a cost of 1 or less to the owner\'s hand or place it at the bottom of their deck.',
  i18n: op11Gotti050I18n,
};
