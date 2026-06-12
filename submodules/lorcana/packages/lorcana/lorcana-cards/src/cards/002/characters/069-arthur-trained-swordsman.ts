import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurTrainedSwordsmanI18n } from "./069-arthur-trained-swordsman.i18n";

export const arthurTrainedSwordsman: CharacterCard = {
  id: "Dov",
  canonicalId: "ci_Dov",
  reprints: ["set2-069"],
  cardType: "character",
  name: "Arthur",
  version: "Trained Swordsman",
  inkType: ["emerald"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 69,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fd6fc618265f462787b1a9bc6c988b54",
    tcgPlayer: 527744,
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: arthurTrainedSwordsmanI18n,
};
