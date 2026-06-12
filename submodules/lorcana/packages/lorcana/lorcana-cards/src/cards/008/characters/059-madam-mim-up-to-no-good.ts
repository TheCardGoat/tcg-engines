import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimUpToNoGoodI18n } from "./059-madam-mim-up-to-no-good.i18n";

export const madamMimUpToNoGood: CharacterCard = {
  id: "EKX",
  canonicalId: "ci_EKX",
  reprints: ["set8-059"],
  cardType: "character",
  name: "Madam Mim",
  version: "Up to No Good",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "008",
  cardNumber: 59,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_246606d417374c8fa6ba822d85eb9e62",
    tcgPlayer: 631390,
  },
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  i18n: madamMimUpToNoGoodI18n,
};
