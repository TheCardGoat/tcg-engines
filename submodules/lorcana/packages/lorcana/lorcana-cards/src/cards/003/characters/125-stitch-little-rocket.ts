import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchLittleRocketI18n } from "./125-stitch-little-rocket.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const stitchLittleRocket: CharacterCard = {
  id: "1PU",
  canonicalId: "ci_1PU",
  slug: "lorcana-ci_1PU",
  printings: [
    {
      id: "set3-125",
      artId: "set3-125",
      setCode: "set3",
      collectorNumber: "125",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-125"],
  cardType: "character",
  name: "Stitch",
  version: "Little Rocket",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "003",
  cardNumber: 125,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_cc036edd4af94499aec28c45e5a3b2a5",
  },
  text: "Rush",
  classifications: ["Dreamborn", "Hero", "Alien"],
  abilities: [rush],
  i18n: stitchLittleRocketI18n,
};
