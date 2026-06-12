import type { CharacterCard } from "@tcg/lorcana-types";
import { toulouseArtisticKittenI18n } from "./165-toulouse-artistic-kitten.i18n";

export const toulouseArtisticKitten: CharacterCard = {
  id: "5do",
  canonicalId: "ci_5do",
  reprints: ["set7-165"],
  cardType: "character",
  name: "Toulouse",
  version: "Artistic Kitten",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "007",
  cardNumber: 165,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a46f9d543f42488aa953e79ab9993010",
    tcgPlayer: 618155,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: toulouseArtisticKittenI18n,
};
