import type { CharacterCard } from "@tcg/lorcana-types";
import { rafikiShamanOfTheSavannaI18n } from "./042-rafiki-shaman-of-the-savanna.i18n";

export const rafikiShamanOfTheSavanna: CharacterCard = {
  id: "9vV",
  canonicalId: "ci_9vV",
  reprints: ["set6-042"],
  cardType: "character",
  name: "Rafiki",
  version: "Shaman of the Savanna",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 42,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2f12cdedeefb448eb412128fb4a80fc7",
    tcgPlayer: 587269,
  },
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  i18n: rafikiShamanOfTheSavannaI18n,
};
