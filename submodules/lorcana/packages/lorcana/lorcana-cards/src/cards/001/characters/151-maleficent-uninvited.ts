import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentUninvitedI18n } from "./151-maleficent-uninvited.i18n";

export const maleficentUninvited: CharacterCard = {
  id: "GaM",
  canonicalId: "ci_GaM",
  reprints: ["set1-151"],
  cardType: "character",
  name: "Maleficent",
  version: "Uninvited",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 151,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7d72a31f03964ae2b79110b788039b73",
    tcgPlayer: 505949,
  },
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  i18n: maleficentUninvitedI18n,
};
