import type { CharacterCard } from "@tcg/lorcana-types";
import { deweyLovableShowoffI18n } from "./002-dewey-lovable-showoff.i18n";

export const deweyLovableShowoff: CharacterCard = {
  id: "nfh",
  canonicalId: "ci_nfh",
  reprints: ["set8-002"],
  cardType: "character",
  name: "Dewey",
  version: "Lovable Showoff",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "008",
  cardNumber: 2,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_31ad785c8eab4eba82f08ec3420584b2",
    tcgPlayer: 633428,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: deweyLovableShowoffI18n,
};
