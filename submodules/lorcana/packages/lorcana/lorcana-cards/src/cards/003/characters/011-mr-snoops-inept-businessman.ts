import type { CharacterCard } from "@tcg/lorcana-types";
import { mrSnoopsIneptBusinessmanI18n } from "./011-mr-snoops-inept-businessman.i18n";

export const mrSnoopsIneptBusinessman: CharacterCard = {
  id: "kVc",
  canonicalId: "ci_kVc",
  reprints: ["set3-011"],
  cardType: "character",
  name: "Mr. Snoops",
  version: "Inept Businessman",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  cardNumber: 11,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 8,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_748599af9c8e4272b5f2926597a405ba",
    tcgPlayer: 539064,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: mrSnoopsIneptBusinessmanI18n,
};
