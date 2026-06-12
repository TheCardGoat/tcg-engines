import type { CharacterCard } from "@tcg/lorcana-types";
import { mufasaKingOfThePrideLandsI18n } from "./155-mufasa-king-of-the-pride-lands.i18n";

export const mufasaKingOfThePrideLands: CharacterCard = {
  id: "4nl",
  canonicalId: "ci_FBP",
  reprints: ["set1-155", "set9-144"],
  cardType: "character",
  name: "Mufasa",
  version: "King of the Pride Lands",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 155,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b7423a2c84b542a58d2605d3a6c28b2b",
    tcgPlayer: 650079,
  },
  classifications: ["Storyborn", "Mentor", "King"],
  i18n: mufasaKingOfThePrideLandsI18n,
};
