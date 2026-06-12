import type { CharacterCard } from "@tcg/lorcana-types";
import { mufasaRespectedKingI18n } from "./196-mufasa-respected-king.i18n";

export const mufasaRespectedKing: CharacterCard = {
  id: "kH7",
  canonicalId: "ci_kH7",
  reprints: ["set7-196"],
  cardType: "character",
  name: "Mufasa",
  version: "Respected King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "007",
  cardNumber: 196,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0f26db7d01c74453b49bf5bc316cfea9",
    tcgPlayer: 618730,
  },
  classifications: ["Storyborn", "Mentor", "King"],
  i18n: mufasaRespectedKingI18n,
};
