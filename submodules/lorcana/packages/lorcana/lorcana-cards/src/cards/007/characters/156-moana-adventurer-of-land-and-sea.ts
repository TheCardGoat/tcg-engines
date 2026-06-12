import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaAdventurerOfLandAndSeaI18n } from "./156-moana-adventurer-of-land-and-sea.i18n";

export const moanaAdventurerOfLandAndSea: CharacterCard = {
  id: "xp6",
  canonicalId: "ci_ncl",
  reprints: ["set7-156"],
  cardType: "character",
  name: "Moana",
  version: "Adventurer of Land and Sea",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "007",
  cardNumber: 156,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2e61b6cfa0da4f32a21cc3375e0855b1",
    tcgPlayer: 618357,
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: moanaAdventurerOfLandAndSeaI18n,
};
