import type { CharacterCard } from "@tcg/lorcana-types";
import { tobyDoggedCompanionI18n } from "./131-toby-dogged-companion.i18n";

export const tobyDoggedCompanion: CharacterCard = {
  id: "Mb2",
  canonicalId: "ci_Mb2",
  reprints: ["set7-131"],
  cardType: "character",
  name: "Toby",
  version: "Dogged Companion",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  cardNumber: 131,
  rarity: "common",
  cost: 1,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1cc513a07b96473ebf95f9369c01c25d",
    tcgPlayer: 618708,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: tobyDoggedCompanionI18n,
};
