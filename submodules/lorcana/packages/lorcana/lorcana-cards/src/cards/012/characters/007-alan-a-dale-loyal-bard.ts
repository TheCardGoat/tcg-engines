import type { CharacterCard } from "@tcg/lorcana-types";
import { alanadaleLoyalBardI18n } from "./007-alan-a-dale-loyal-bard.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const alanadaleLoyalBard: CharacterCard = {
  id: "BxQ",
  canonicalId: "ci_BxQ",
  slug: "lorcana-ci_BxQ",
  printings: [
    {
      id: "set12-007",
      artId: "set12-007",
      setCode: "set12",
      collectorNumber: "7",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-007"],
  cardType: "character",
  name: "Alan-a-Dale",
  version: "Loyal Bard",
  inkType: ["amber"],
  franchise: "Robin Hood",
  set: "012",
  cardNumber: 7,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9b3e23958e8c439db9998f14adeba943",
    tcgPlayer: "692008",
  },
  text: "Singer 4",
  classifications: ["Storyborn", "Ally"],
  abilities: [singer(4)],
  i18n: alanadaleLoyalBardI18n,
};
