import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiBoatSnackP1PromoI18n } from "./p1-009-heihei-boat-snack-promo.i18n";

import { support } from "../../../helpers/abilities/support";

export const heiheiBoatSnackP1Promo: CharacterCard = {
  id: "PTP",
  canonicalId: "ci_Tbp",
  slug: "lorcana-ci_Tbp",
  printings: [
    {
      id: "set1-p1-009-promo",
      artId: "ci_Tbp-promo",
      setCode: "set1",
      collectorNumber: "9",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-007"],
  cardType: "character",
  name: "HeiHei",
  version: "Boat Snack",
  inkType: ["amber"],
  franchise: "Moana",
  set: "001",
  cardNumber: 9,
  rarity: "special",
  specialRarity: "promo",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7b875417a470447eb4d998d9b634580b",
    tcgPlayer: "493479",
  },
  text: "Support",
  classifications: ["Storyborn", "Ally"],
  abilities: [support],
  i18n: heiheiBoatSnackP1PromoI18n,
};
