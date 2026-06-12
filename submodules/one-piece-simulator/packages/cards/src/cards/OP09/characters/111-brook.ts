import type { CharacterCard } from "@tcg/op-types";
import { op09Brook111I18n } from "./111-brook.i18n.ts";

export const op09Brook111: CharacterCard = {
  id: "OP09-111",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    'If your Leader has the "Egghead" type and your opponent has 6 or more cards in their hand, your opponent trashes 2 cards from their hand.',
  traits: ["Straw Hat Crew Egghead"],
  attribute: "slash",
  effect:
    '[Trigger] If your Leader has the "Egghead" type and your opponent has 6 or more cards in their hand, your opponent trashes 2 cards from their hand.',
  i18n: op09Brook111I18n,
};
