import type { CharacterCard } from "@tcg/lorcana-types";
import { mufasaChampionOfThePrideLandsI18n } from "./185-mufasa-champion-of-the-pride-lands.i18n";

export const mufasaChampionOfThePrideLands: CharacterCard = {
  id: "bHG",
  canonicalId: "ci_bHG",
  reprints: ["set3-185"],
  cardType: "character",
  name: "Mufasa",
  version: "Champion of the Pride Lands",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 185,
  rarity: "rare",
  cost: 7,
  strength: 3,
  willpower: 10,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_40537dcea12e45f1b057ab68b337632c",
    tcgPlayer: 539112,
  },
  classifications: ["Storyborn", "Mentor", "King"],
  i18n: mufasaChampionOfThePrideLandsI18n,
};
