import type { CharacterCard } from "@tcg/lorcana-types";
import { kronkRighthandManI18n } from "./183-kronk-right-hand-man.i18n";

export const kronkRighthandMan: CharacterCard = {
  id: "pxO",
  canonicalId: "ci_pxO",
  reprints: ["set1-183"],
  cardType: "character",
  name: "Kronk",
  version: "Right-Hand Man",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "001",
  cardNumber: 183,
  rarity: "uncommon",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_4dff2ba7b2d744a1a6c33741e2c1fcf6",
    tcgPlayer: 503320,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: kronkRighthandManI18n,
};
