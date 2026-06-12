import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesSpectralDemigod } from "./117-hercules-spectral-demigod";

export const herculesSpectralDemigodEpic: CharacterCard = {
  ...herculesSpectralDemigod,
  id: "MXG",
  reprints: ["set11-117"],
  set: "011",
  cardNumber: 214,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_366f46e2c0bc4366832935158a49cdb4",
    tcgPlayer: 677149,
  },
};
