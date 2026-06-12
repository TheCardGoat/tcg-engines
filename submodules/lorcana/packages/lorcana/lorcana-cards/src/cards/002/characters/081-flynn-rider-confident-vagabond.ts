import type { CharacterCard } from "@tcg/lorcana-types";
import { flynnRiderConfidentVagabondI18n } from "./081-flynn-rider-confident-vagabond.i18n";

export const flynnRiderConfidentVagabond: CharacterCard = {
  id: "Svn",
  canonicalId: "ci_Svn",
  reprints: ["set2-081"],
  cardType: "character",
  name: "Flynn Rider",
  version: "Confident Vagabond",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "002",
  cardNumber: 81,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_e6055fbcee8a4a03a980c5e2e3a2cff9",
    tcgPlayer: 517453,
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: flynnRiderConfidentVagabondI18n,
};
