import type { CharacterCard } from "@tcg/lorcana-types";
import { theWardrobeBellesConfidantI18n } from "./057-the-wardrobe-belles-confidant.i18n";

export const theWardrobeBellesConfidant: CharacterCard = {
  id: "FRs",
  canonicalId: "ci_FRs",
  reprints: ["set1-057"],
  cardType: "character",
  name: "The Wardrobe",
  version: "Belle’s Confidant",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 57,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0ab2ecd7d121461e8053278706d889d5",
    tcgPlayer: 485363,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: theWardrobeBellesConfidantI18n,
};
