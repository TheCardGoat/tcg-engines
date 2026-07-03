import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiDemigodP1I18n } from "./p1-023-maui-demigod.i18n";

export const mauiDemigodP1: CharacterCard = {
  id: "3yS",
  canonicalId: "ci_mg0",
  slug: "lorcana-ci_mg0",
  printings: [
    {
      id: "set1-p1-023",
      artId: "set1-p1-023",
      setCode: "set1",
      collectorNumber: "23",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set1-p1-023", "set1-185"],
  cardType: "character",
  name: "Maui",
  version: "Demigod",
  inkType: ["steel"],
  franchise: "Moana",
  set: "001",
  cardNumber: 23,
  rarity: "special",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d32d5f07d1274a6ebcf0e8e437155768",
    tcgPlayer: "502018",
  },
  classifications: ["Storyborn", "Hero", "Deity"],
  i18n: mauiDemigodP1I18n,
};
