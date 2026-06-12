import type { CharacterCard } from "@tcg/lorcana-types";
import { nutsyVultureHenchmanI18n } from "./118-nutsy-vulture-henchman.i18n";

export const nutsyVultureHenchman: CharacterCard = {
  id: "RJ7",
  canonicalId: "ci_RJ7",
  reprints: ["set3-118"],
  cardType: "character",
  name: "Nutsy",
  version: "Vulture Henchman",
  inkType: ["ruby"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 118,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d9f88c1c25a1490f9cac1cef82b51219",
    tcgPlayer: 537940,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: nutsyVultureHenchmanI18n,
};
