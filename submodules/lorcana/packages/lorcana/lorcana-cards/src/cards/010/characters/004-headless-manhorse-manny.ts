import type { CharacterCard } from "@tcg/lorcana-types";
import { headlessManhorseMannyI18n } from "./004-headless-manhorse-manny.i18n";

export const headlessManhorseManny: CharacterCard = {
  id: "foC",
  canonicalId: "ci_foC",
  reprints: ["set10-004"],
  cardType: "character",
  name: "Headless Manhorse",
  version: "Manny",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 4,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 10,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b29df88a89414f9cb5ad2f74b7fd428c",
    tcgPlayer: 660014,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: headlessManhorseMannyI18n,
};
