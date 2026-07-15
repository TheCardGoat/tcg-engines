import type { CharacterCard } from "@tcg/lorcana-types";
import { mrSmeeLoyalFirstMateI18n } from "./015-mr-smee-loyal-first-mate.i18n";

export const mrSmeeLoyalFirstMate: CharacterCard = {
  id: "ExX",
  canonicalId: "ci_ExX",
  slug: "lorcana-ci_ExX",
  printings: [
    {
      id: "set1-015",
      artId: "set1-015",
      setCode: "set1",
      collectorNumber: "15",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-015"],
  cardType: "character",
  name: "Mr. Smee",
  version: "Loyal First Mate",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 15,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ef759d382c954423b841d6cbac94dfbc",
    tcgPlayer: "508697",
  },
  classifications: ["Dreamborn", "Ally", "Pirate"],
  i18n: mrSmeeLoyalFirstMateI18n,
};
