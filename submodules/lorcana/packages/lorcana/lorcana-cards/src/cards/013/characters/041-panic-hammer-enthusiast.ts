import type { CharacterCard } from "@tcg/lorcana-types";
import { panicHammerEnthusiastI18n } from "./041-panic-hammer-enthusiast.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const panicHammerEnthusiast: CharacterCard = {
  id: "CnY",
  canonicalId: "ci_CnY",
  slug: "lorcana-ci_CnY",
  printings: [
    {
      id: "set13-041",
      artId: "set13-041",
      setCode: "set13",
      collectorNumber: "41",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-041"],
  cardType: "character",
  name: "Panic",
  version: "Hammer Enthusiast",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "013",
  cardNumber: 41,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c40e1577de48469abc89a34509709824",
  },
  text: "Rush",
  classifications: ["Storyborn", "Ally"],
  abilities: [rush],
  i18n: panicHammerEnthusiastI18n,
};
