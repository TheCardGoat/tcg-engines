import type { CharacterCard } from "@tcg/lorcana-types";
import { wendyDarlingTalentedSailorI18n } from "./023-wendy-darling-talented-sailor.i18n";

export const wendyDarlingTalentedSailor: CharacterCard = {
  id: "cDB",
  canonicalId: "ci_cDB",
  reprints: ["set3-023"],
  cardType: "character",
  name: "Wendy Darling",
  version: "Talented Sailor",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 23,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_e989edbf82194e8e9f4bd73426377d57",
    tcgPlayer: 538380,
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: wendyDarlingTalentedSailorI18n,
};
