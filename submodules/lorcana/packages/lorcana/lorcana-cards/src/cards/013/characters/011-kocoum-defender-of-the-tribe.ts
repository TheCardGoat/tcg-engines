import type { CharacterCard } from "@tcg/lorcana-types";
import { kocoumDefenderOfTheTribeI18n } from "./011-kocoum-defender-of-the-tribe.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const kocoumDefenderOfTheTribe: CharacterCard = {
  id: "e1z",
  canonicalId: "ci_e1z",
  slug: "lorcana-ci_e1z",
  printings: [
    {
      id: "set13-011",
      artId: "set13-011",
      setCode: "set13",
      collectorNumber: "11",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-011"],
  cardType: "character",
  name: "Kocoum",
  version: "Defender of the Tribe",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "013",
  cardNumber: 11,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_79c67a3bbf9f48e9ac759264d0ded41a",
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: kocoumDefenderOfTheTribeI18n,
};
