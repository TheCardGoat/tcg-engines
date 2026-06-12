import type { CharacterCard } from "@tcg/lorcana-types";
import { faLiMulansMotherI18n } from "./143-fa-li-mulans-mother.i18n";

export const faLiMulansMother: CharacterCard = {
  id: "DxW",
  canonicalId: "ci_DxW",
  reprints: ["set4-143"],
  cardType: "character",
  name: "Fa Li",
  version: "Mulan’s Mother",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 143,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b792d79485f44ddd8d1fb20b25cb19a3",
    tcgPlayer: 549527,
  },
  classifications: ["Storyborn", "Mentor"],
  i18n: faLiMulansMotherI18n,
};
