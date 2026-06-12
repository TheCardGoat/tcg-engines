import type { CharacterCard } from "@tcg/lorcana-types";
import { argesTheCyclopsI18n } from "./173-arges-the-cyclops.i18n";

export const argesTheCyclops: CharacterCard = {
  id: "6DG",
  canonicalId: "ci_6DG",
  reprints: ["set4-173"],
  cardType: "character",
  name: "Arges",
  version: "The Cyclops",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 173,
  rarity: "common",
  cost: 2,
  strength: 4,
  willpower: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8b213fe23fec4f629b8368b197d7d7c8",
    tcgPlayer: 549558,
  },
  classifications: ["Storyborn", "Titan"],
  i18n: argesTheCyclopsI18n,
};
