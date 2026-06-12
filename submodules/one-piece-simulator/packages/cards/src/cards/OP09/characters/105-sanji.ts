import type { CharacterCard } from "@tcg/op-types";
import { op09Sanji105I18n } from "./105-sanji.i18n.ts";

export const op09Sanji105: CharacterCard = {
  id: "OP09-105",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    'If your Leader has the "Egghead" type, add up to 1 card from the top of your deck to the top of your Life cards. Then, trash 2 cards from your hand.',
  traits: ["Straw Hat Crew Egghead"],
  attribute: "strike",
  effect:
    '[Trigger] If your Leader has the "Egghead" type, add up to 1 card from the top of your deck to the top of your Life cards. Then, trash 2 cards from your hand.',
  i18n: op09Sanji105I18n,
};
