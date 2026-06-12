import type { CharacterCard } from "@tcg/lorcana-types";
import { beastThickskinnedI18n } from "./176-beast-thick-skinned.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const beastThickskinned: CharacterCard = {
  id: "P74",
  canonicalId: "ci_P74",
  reprints: ["set4-176"],
  cardType: "character",
  name: "Beast",
  version: "Thick-Skinned",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 176,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_aca54534108b43fcb881cb411581c618",
    tcgPlayer: 549654,
  },
  text: "Resist +1",
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [resist(1)],
  i18n: beastThickskinnedI18n,
};
