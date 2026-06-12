import type { CharacterCard } from "@tcg/lorcana-types";
import { painImmortalSidekickI18n } from "./081-pain-immortal-sidekick.i18n";

export const painImmortalSidekick: CharacterCard = {
  id: "eqA",
  canonicalId: "ci_eqA",
  reprints: ["set4-081"],
  cardType: "character",
  name: "Pain",
  version: "Immortal Sidekick",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 81,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ca58ca94b74e4df8983b1eaecff999a3",
    tcgPlayer: 550578,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: painImmortalSidekickI18n,
};
