import type { CharacterCard } from "@tcg/lorcana-types";
import { drFacilierCharlatanI18n } from "./038-dr-facilier-charlatan.i18n";

import { challenger } from "../../../helpers/abilities/challenger";

export const drFacilierCharlatan: CharacterCard = {
  id: "wGC",
  canonicalId: "ci_wGC",
  slug: "lorcana-ci_wGC",
  printings: [
    {
      id: "set1-038",
      artId: "set1-038",
      setCode: "set1",
      collectorNumber: "38",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-038"],
  cardType: "character",
  name: "Dr. Facilier",
  version: "Charlatan",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  cardNumber: 38,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_17c7228380dd4d8e8b5e2cce3058d9d3",
    tcgPlayer: "494099",
  },
  text: "Challenger +2",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [challenger(2)],
  i18n: drFacilierCharlatanI18n,
};
