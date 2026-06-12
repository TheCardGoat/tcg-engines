import type { CharacterCard } from "@tcg/lorcana-types";
import { theFirebirdForceOfDestructionI18n } from "./056-the-firebird-force-of-destruction.i18n";

export const theFirebirdForceOfDestruction: CharacterCard = {
  id: "RNV",
  canonicalId: "ci_RNV",
  reprints: ["set3-056"],
  cardType: "character",
  name: "The Firebird",
  version: "Force of Destruction",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 56,
  rarity: "common",
  cost: 4,
  strength: 6,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_67c15e1a10e04510a5f6c78cf9119e22",
    tcgPlayer: 537826,
  },
  classifications: ["Dreamborn", "Villain"],
  i18n: theFirebirdForceOfDestructionI18n,
};
