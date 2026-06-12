import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaAtlanteanI18n } from "./006-kida-atlantean.i18n";

export const kidaAtlantean: CharacterCard = {
  id: "6Uk",
  canonicalId: "ci_6Uk",
  reprints: ["set3-006"],
  cardType: "character",
  name: "Kida",
  version: "Atlantean",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 6,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0f90f3b193fa44789e5abeb293636e4f",
    tcgPlayer: 536275,
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: kidaAtlanteanI18n,
};
