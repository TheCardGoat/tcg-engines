import type { CharacterCard } from "@tcg/lorcana-types";
import { torFloristI18n } from "./091-tor-florist.i18n";

export const torFlorist: CharacterCard = {
  id: "iSO",
  canonicalId: "ci_iSO",
  reprints: ["set4-091"],
  cardType: "character",
  name: "Tor",
  version: "Florist",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "004",
  cardNumber: 91,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_da27f6ea33754e3990af2592197c8c35",
    tcgPlayer: 547775,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: torFloristI18n,
};
