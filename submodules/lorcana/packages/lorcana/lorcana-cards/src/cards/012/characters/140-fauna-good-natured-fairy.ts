import type { CharacterCard } from "@tcg/lorcana-types";
import { faunaGoodnaturedFairyI18n } from "./140-fauna-good-natured-fairy.i18n";

import { support } from "../../../helpers/abilities/support";

export const faunaGoodnaturedFairy: CharacterCard = {
  id: "lVp",
  canonicalId: "ci_lVp",
  slug: "lorcana-ci_lVp",
  printings: [
    {
      id: "set12-140",
      artId: "set12-140",
      setCode: "set12",
      collectorNumber: "140",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-140"],
  cardType: "character",
  name: "Fauna",
  version: "Good-Natured Fairy",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "012",
  cardNumber: 140,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1b2280c5875e45cbb27ced6f0116c762",
    tcgPlayer: "692060",
  },
  text: "Support",
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [support],
  i18n: faunaGoodnaturedFairyI18n,
};
