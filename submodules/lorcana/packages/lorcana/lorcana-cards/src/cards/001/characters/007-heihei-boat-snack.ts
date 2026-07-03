import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiBoatSnackI18n } from "./007-heihei-boat-snack.i18n";

import { support } from "../../../helpers/abilities/support";

export const heiheiBoatSnack: CharacterCard = {
  id: "fZh",
  canonicalId: "ci_Tbp",
  slug: "lorcana-ci_Tbp",
  printings: [
    {
      id: "set1-007",
      artId: "set1-007",
      setCode: "set1",
      collectorNumber: "7",
      rarity: "common",
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
  cardNumber: 7,
  rarity: "common",
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
  i18n: heiheiBoatSnackI18n,
};
