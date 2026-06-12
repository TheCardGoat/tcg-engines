import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletVerySmallAnimalI18n } from "./018-piglet-very-small-animal.i18n";

export const pigletVerySmallAnimal: CharacterCard = {
  id: "sVL",
  canonicalId: "ci_sVL",
  reprints: ["set2-018"],
  cardType: "character",
  name: "Piglet",
  version: "Very Small Animal",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 18,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9eba1ff8237f48d9aa89b725e90e2fb4",
    tcgPlayer: 527720,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: pigletVerySmallAnimalI18n,
};
