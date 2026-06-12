import type { CharacterCard } from "@tcg/lorcana-types";
import { basilPerceptiveInvestigatorI18n } from "./140-basil-perceptive-investigator.i18n";

export const basilPerceptiveInvestigator: CharacterCard = {
  id: "Vg9",
  canonicalId: "ci_Vg9",
  reprints: ["set2-140"],
  cardType: "character",
  name: "Basil",
  version: "Perceptive Investigator",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 140,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c26b377f986245bd8f63360bcf26d5be",
    tcgPlayer: 525243,
  },
  classifications: ["Storyborn", "Hero", "Detective"],
  i18n: basilPerceptiveInvestigatorI18n,
};
