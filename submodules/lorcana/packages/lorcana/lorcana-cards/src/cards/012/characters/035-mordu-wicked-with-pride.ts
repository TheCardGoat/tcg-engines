import type { CharacterCard } from "@tcg/lorcana-types";
import { morduWickedWithPrideI18n } from "./035-mordu-wicked-with-pride.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const morduWickedWithPride: CharacterCard = {
  id: "rHk",
  canonicalId: "ci_rHk",
  slug: "lorcana-ci_rHk",
  printings: [
    {
      id: "set12-035",
      artId: "set12-035",
      setCode: "set12",
      collectorNumber: "35",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-035"],
  cardType: "character",
  name: "Mor'du",
  version: "Wicked with Pride",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 35,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_6ed671e897624e01b14ca2e5db565d06",
    tcgPlayer: "690523",
  },
  text: "Rush",
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [rush],
  i18n: morduWickedWithPrideI18n,
};
