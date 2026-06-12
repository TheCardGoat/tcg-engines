import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAbominationI18n } from "./125-stitch-abomination.i18n";

export const stitchAbomination: CharacterCard = {
  id: "LKL",
  canonicalId: "ci_LKL",
  reprints: ["set1-125"],
  cardType: "character",
  name: "Stitch",
  version: "Abomination",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 125,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_19a7e851b7724bd58b285b76eb387c5a",
    tcgPlayer: 508790,
  },
  classifications: ["Storyborn", "Hero", "Alien"],
  i18n: stitchAbominationI18n,
};
