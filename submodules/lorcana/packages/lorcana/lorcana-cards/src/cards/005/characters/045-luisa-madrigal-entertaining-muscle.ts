import type { CharacterCard } from "@tcg/lorcana-types";
import { luisaMadrigalEntertainingMuscleI18n } from "./045-luisa-madrigal-entertaining-muscle.i18n";

export const luisaMadrigalEntertainingMuscle: CharacterCard = {
  id: "GTb",
  canonicalId: "ci_GTb",
  reprints: ["set5-045"],
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Entertaining Muscle",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "005",
  cardNumber: 45,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 8,
  lore: 3,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5c628b6eefe64685a02ea0bd3bef7a44",
    tcgPlayer: 557729,
  },
  classifications: ["Storyborn", "Ally", "Madrigal"],
  i18n: luisaMadrigalEntertainingMuscleI18n,
};
