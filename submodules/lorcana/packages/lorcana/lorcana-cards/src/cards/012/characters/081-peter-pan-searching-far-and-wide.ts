import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanSearchingFarAndWideI18n } from "./081-peter-pan-searching-far-and-wide.i18n";

export const peterPanSearchingFarAndWide: CharacterCard = {
  id: "h96",
  canonicalId: "ci_h96",
  reprints: ["set12-081"],
  cardType: "character",
  name: "Peter Pan",
  version: "Searching Far and Wide",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "012",
  cardNumber: 81,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d6cd900ff0684586bbcb200553e6cd9a",
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: peterPanSearchingFarAndWideI18n,
};
