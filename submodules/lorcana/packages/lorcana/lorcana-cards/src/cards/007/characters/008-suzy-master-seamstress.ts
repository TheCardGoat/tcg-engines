import type { CharacterCard } from "@tcg/lorcana-types";
import { suzyMasterSeamstressI18n } from "./008-suzy-master-seamstress.i18n";

export const suzyMasterSeamstress: CharacterCard = {
  id: "Jav",
  canonicalId: "ci_Jav",
  reprints: ["set7-008"],
  cardType: "character",
  name: "Suzy",
  version: "Master Seamstress",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "007",
  cardNumber: 8,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_06b99488cc904626be99d5646a5f4c91",
    tcgPlayer: 619411,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: suzyMasterSeamstressI18n,
};
