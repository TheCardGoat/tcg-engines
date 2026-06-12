import type { CharacterCard } from "@tcg/lorcana-types";
import { hansSchemingPrinceI18n } from "./078-hans-scheming-prince.i18n";

export const hansSchemingPrince: CharacterCard = {
  id: "7lM",
  canonicalId: "ci_7lM",
  reprints: ["set1-078"],
  cardType: "character",
  name: "Hans",
  version: "Scheming Prince",
  inkType: ["emerald"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 78,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c0ca53eaf2d849e7b533d0628ea7585c",
    tcgPlayer: 505954,
  },
  classifications: ["Storyborn", "Villain", "Prince"],
  i18n: hansSchemingPrinceI18n,
};
