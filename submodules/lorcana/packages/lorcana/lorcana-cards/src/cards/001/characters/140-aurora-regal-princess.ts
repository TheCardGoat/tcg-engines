import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraRegalPrincessI18n } from "./140-aurora-regal-princess.i18n";

export const auroraRegalPrincess: CharacterCard = {
  id: "tuh",
  canonicalId: "ci_LLH",
  reprints: ["set1-140", "set9-161"],
  cardType: "character",
  name: "Aurora",
  version: "Regal Princess",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 140,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3935700ef8a04122935f3a9289dfa4af",
    tcgPlayer: 650095,
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: auroraRegalPrincessI18n,
};
