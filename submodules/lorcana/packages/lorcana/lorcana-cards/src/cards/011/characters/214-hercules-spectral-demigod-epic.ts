import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesSpectralDemigodEpicI18n } from "./214-hercules-spectral-demigod-epic.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const herculesSpectralDemigodEpic: CharacterCard = {
  id: "MI7",
  canonicalId: "ci_hMF",
  slug: "lorcana-ci_hMF",
  printings: [
    {
      id: "set11-214-epic",
      artId: "ci_hMF-epic",
      setCode: "set11",
      collectorNumber: "214",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-117"],
  cardType: "character",
  name: "Hercules",
  version: "Spectral Demigod",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "011",
  cardNumber: 214,
  rarity: "common",
  specialRarity: "epic",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_366f46e2c0bc4366832935158a49cdb4",
    tcgPlayer: "677149",
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "SUPERHUMAN STRENGTH",
      description: "While there's a card under this character, he gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Deity", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "16g-2",
      name: "SUPERHUMAN STRENGTH",
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
      text: "SUPERHUMAN STRENGTH While there’s a card under this character, he gets +3 {S}.",
    },
  ],
  i18n: herculesSpectralDemigodEpicI18n,
};
