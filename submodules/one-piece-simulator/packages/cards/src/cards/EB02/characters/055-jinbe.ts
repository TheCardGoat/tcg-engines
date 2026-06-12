import type { CharacterCard } from "@tcg/op-types";
import { eb02Jinbe055I18n } from "./055-jinbe.i18n.ts";

export const eb02Jinbe055: CharacterCard = {
  id: "EB02-055",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger:
    'If your Leader has the "Fish-Man" or "Merfolk" type and you have 2 or less Life cards, play this card.',
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect:
    '[Trigger] If your Leader has the "Fish-Man" or "Merfolk" type and you have 2 or less Life cards, play this card.',
  i18n: eb02Jinbe055I18n,
};
