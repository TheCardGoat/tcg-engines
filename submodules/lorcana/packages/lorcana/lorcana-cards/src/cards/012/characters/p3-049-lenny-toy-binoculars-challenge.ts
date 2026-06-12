import type { CharacterCard } from "@tcg/lorcana-types";
import { lennyToyBinocularsP3ChallengeI18n } from "./p3-049-lenny-toy-binoculars-challenge.i18n";
import { lennyToyBinoculars } from "./079-lenny-toy-binoculars";

export const lennyToyBinocularsP3Challenge: CharacterCard = {
  ...lennyToyBinoculars,
  id: "0LB",
  set: "P03",
  cardNumber: 49,
  rarity: "special",
  specialRarity: "challenge",
  i18n: lennyToyBinocularsP3ChallengeI18n,
};
