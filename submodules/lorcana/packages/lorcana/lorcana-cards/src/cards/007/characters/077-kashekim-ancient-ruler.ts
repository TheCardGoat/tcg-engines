import type { CharacterCard } from "@tcg/lorcana-types";
import { kashekimAncientRulerI18n } from "./077-kashekim-ancient-ruler.i18n";

export const kashekimAncientRuler: CharacterCard = {
  id: "COQ",
  canonicalId: "ci_K5D",
  reprints: ["set7-077"],
  cardType: "character",
  name: "Kashekim",
  version: "Ancient Ruler",
  inkType: ["amethyst"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 77,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0c0360dcefeb4a60bec287543d586f28",
    tcgPlayer: 618268,
  },
  classifications: ["Storyborn", "King"],
  i18n: kashekimAncientRulerI18n,
};
