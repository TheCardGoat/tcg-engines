import type { CharacterCard } from "@tcg/lorcana-types";
import { kingLouieBandleaderI18n } from "./146-king-louie-bandleader.i18n";

export const kingLouieBandleader: CharacterCard = {
  id: "yXk",
  canonicalId: "ci_yXk",
  reprints: ["set3-146"],
  cardType: "character",
  name: "King Louie",
  version: "Bandleader",
  inkType: ["sapphire"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 146,
  rarity: "common",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fc70bb26c18544679b91bca3a7ad025c",
    tcgPlayer: 538243,
  },
  classifications: ["Storyborn", "Ally", "King"],
  i18n: kingLouieBandleaderI18n,
};
