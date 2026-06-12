import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesSpectralDemigodI18n } from "./117-hercules-spectral-demigod.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const herculesSpectralDemigod: CharacterCard = {
  id: "pHV",
  canonicalId: "ci_hMF",
  reprints: ["set11-117"],
  cardType: "character",
  name: "Hercules",
  version: "Spectral Demigod",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "011",
  cardNumber: 117,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_366f46e2c0bc4366832935158a49cdb4",
    tcgPlayer: 677149,
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
  i18n: herculesSpectralDemigodI18n,
};
