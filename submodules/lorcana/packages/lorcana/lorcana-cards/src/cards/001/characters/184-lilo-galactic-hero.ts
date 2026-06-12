import type { CharacterCard } from "@tcg/lorcana-types";
import { liloGalacticHeroI18n } from "./184-lilo-galactic-hero.i18n";

export const liloGalacticHero: CharacterCard = {
  id: "NhZ",
  canonicalId: "ci_NhZ",
  reprints: ["set1-184"],
  cardType: "character",
  name: "Lilo",
  version: "Galactic Hero",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 184,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6a986375d35444ad9660332cda624a14",
    tcgPlayer: 508920,
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: liloGalacticHeroI18n,
};
