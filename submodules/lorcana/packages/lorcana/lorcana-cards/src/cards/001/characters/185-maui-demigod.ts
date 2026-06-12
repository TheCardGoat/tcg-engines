import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiDemigodI18n } from "./185-maui-demigod.i18n";

export const mauiDemigod: CharacterCard = {
  id: "nM3",
  canonicalId: "ci_nM3",
  reprints: ["set1-185"],
  cardType: "character",
  name: "Maui",
  version: "Demigod",
  inkType: ["steel"],
  franchise: "Moana",
  set: "001",
  cardNumber: 185,
  rarity: "rare",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d32d5f07d1274a6ebcf0e8e437155768",
    tcgPlayer: 502018,
  },
  classifications: ["Storyborn", "Hero", "Deity"],
  i18n: mauiDemigodI18n,
};
