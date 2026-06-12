import type { CharacterCard } from "@tcg/lorcana-types";
import { banzaiGluttonousPredatorI18n } from "./080-banzai-gluttonous-predator.i18n";

export const banzaiGluttonousPredator: CharacterCard = {
  id: "q1j",
  canonicalId: "ci_q1j",
  reprints: ["set5-080"],
  cardType: "character",
  name: "Banzai",
  version: "Gluttonous Predator",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 80,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9a47b5d5d819442882b5319fab5ed77a",
    tcgPlayer: 561957,
  },
  classifications: ["Storyborn", "Ally", "Hyena"],
  i18n: banzaiGluttonousPredatorI18n,
};
