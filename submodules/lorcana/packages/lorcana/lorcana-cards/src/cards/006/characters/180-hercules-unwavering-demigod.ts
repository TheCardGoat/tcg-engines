import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesUnwaveringDemigodI18n } from "./180-hercules-unwavering-demigod.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const herculesUnwaveringDemigod: CharacterCard = {
  id: "jJs",
  canonicalId: "ci_jJs",
  reprints: ["set6-180"],
  cardType: "character",
  name: "Hercules",
  version: "Unwavering Demigod",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "006",
  cardNumber: 180,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1c5e7d4a006c4736baf5e602734fec5b",
    tcgPlayer: 593011,
  },
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [challenger(2)],
  i18n: herculesUnwaveringDemigodI18n,
};
