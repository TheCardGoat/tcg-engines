import type { CharacterCard } from "@tcg/lorcana-types";
import { nessusRiverGuardianI18n } from "./118-nessus-river-guardian.i18n";

export const nessusRiverGuardian: CharacterCard = {
  id: "u1p",
  canonicalId: "ci_u1p",
  reprints: ["set4-118"],
  cardType: "character",
  name: "Nessus",
  version: "River Guardian",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 118,
  rarity: "uncommon",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8ae1e6ad39e04645b85489774efd1418",
    tcgPlayer: 550595,
  },
  classifications: ["Storyborn", "Villain"],
  i18n: nessusRiverGuardianI18n,
};
