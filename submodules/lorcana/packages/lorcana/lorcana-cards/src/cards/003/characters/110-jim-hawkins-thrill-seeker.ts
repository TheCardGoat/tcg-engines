import type { CharacterCard } from "@tcg/lorcana-types";
import { jimHawkinsThrillSeekerI18n } from "./110-jim-hawkins-thrill-seeker.i18n";

export const jimHawkinsThrillSeeker: CharacterCard = {
  id: "n5A",
  canonicalId: "ci_n5A",
  reprints: ["set3-110"],
  cardType: "character",
  name: "Jim Hawkins",
  version: "Thrill Seeker",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 110,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bdeabb102e8a43af9b4e1699df256503",
    tcgPlayer: 536113,
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: jimHawkinsThrillSeekerI18n,
};
