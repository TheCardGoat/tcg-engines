import type { CharacterCard } from "@tcg/lorcana-types";
import { princeNaveenBundledUpI18n } from "./173-prince-naveen-bundled-up.i18n";

export const princeNaveenBundledUp: CharacterCard = {
  id: "zSE",
  canonicalId: "ci_zSE",
  reprints: ["set11-173"],
  cardType: "character",
  name: "Prince Naveen",
  version: "Bundled Up",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "011",
  cardNumber: 173,
  rarity: "common",
  cost: 5,
  strength: 7,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  abilities: [],
  externalIds: {
    lorcast: "crd_6c7e5e05d9ad44ceb4f84c5a82ee8c6b",
    tcgPlayer: 676236,
  },
  classifications: ["Dreamborn", "Hero", "Prince"],
  i18n: princeNaveenBundledUpI18n,
};
