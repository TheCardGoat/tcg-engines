import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckCrimeFighterI18n } from "./174-darkwing-duck-crime-fighter.i18n";

export const darkwingDuckCrimeFighter: CharacterCard = {
  id: "HIg",
  canonicalId: "ci_HIg",
  reprints: ["set11-174"],
  cardType: "character",
  name: "Darkwing Duck",
  version: "Crime Fighter",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 174,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b776bea5bc784d669be7db1efd244ef3",
    tcgPlayer: 677140,
  },
  classifications: ["Storyborn", "Super", "Hero", "Detective"],
  abilities: [],
  i18n: darkwingDuckCrimeFighterI18n,
};
