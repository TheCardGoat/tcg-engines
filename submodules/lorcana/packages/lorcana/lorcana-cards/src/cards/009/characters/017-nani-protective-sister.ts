import type { CharacterCard } from "@tcg/lorcana-types";
import { naniProtectiveSisterI18n } from "./017-nani-protective-sister.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const naniProtectiveSister: CharacterCard = {
  id: "Utg",
  canonicalId: "ci_2at",
  slug: "lorcana-ci_2at",
  printings: [
    {
      id: "set9-017",
      artId: "set9-017",
      setCode: "set9",
      collectorNumber: "17",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set3-012", "set9-017"],
  cardType: "character",
  name: "Nani",
  version: "Protective Sister",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "009",
  cardNumber: 17,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_46a9657cca954d1981ba9f69647ebe44",
    tcgPlayer: "649965",
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Hero"],
  abilities: [bodyguard],
  i18n: naniProtectiveSisterI18n,
};
