import type { CharacterCard } from "@tcg/lorcana-types";
import { bagheeraCautiousExplorerI18n } from "./012-bagheera-cautious-explorer.i18n";

export const bagheeraCautiousExplorer: CharacterCard = {
  id: "G0X",
  canonicalId: "ci_G0X",
  reprints: ["set10-012"],
  cardType: "character",
  name: "Bagheera",
  version: "Cautious Explorer",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 12,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bd27b70ddc3540489c47c824128ec53f",
    tcgPlayer: 659180,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: bagheeraCautiousExplorerI18n,
};
