import type { CharacterCard } from "@tcg/lorcana-types";
import { cerberusThreeheadedDogI18n } from "./176-cerberus-three-headed-dog.i18n";

export const cerberusThreeheadedDog: CharacterCard = {
  id: "sNx",
  canonicalId: "ci_sNx",
  reprints: ["set1-176"],
  cardType: "character",
  name: "Cerberus",
  version: "Three-Headed Dog",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 176,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_25c3b767ba91433682a1643b31b7645b",
    tcgPlayer: 497206,
  },
  classifications: ["Storyborn"],
  i18n: cerberusThreeheadedDogI18n,
};
