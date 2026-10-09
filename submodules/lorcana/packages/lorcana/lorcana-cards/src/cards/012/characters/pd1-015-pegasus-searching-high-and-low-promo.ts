import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusSearchingHighAndLowPD1PromoI18n } from "./pd1-015-pegasus-searching-high-and-low-promo.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const pegasusSearchingHighAndLowPD1Promo: CharacterCard = {
  id: "Frn",
  canonicalId: "ci_t4R",
  slug: "lorcana-ci_t4R",
  printings: [
    {
      id: "set12-pd1-015-promo",
      artId: "ci_t4R-promo",
      setCode: "set12",
      collectorNumber: "15",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set12-106"],
  cardType: "character",
  name: "Pegasus",
  version: "Searching High and Low",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "012",
  cardNumber: 15,
  rarity: "special",
  specialRarity: "promo",
  cost: 6,
  strength: 6,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0a746213099d4c5eaf9ea5bf5926a411",
    tcgPlayer: "692050",
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Ally"],
  abilities: [evasive],
  i18n: pegasusSearchingHighAndLowPD1PromoI18n,
};
