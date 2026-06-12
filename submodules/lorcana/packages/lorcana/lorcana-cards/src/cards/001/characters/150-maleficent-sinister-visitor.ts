import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentSinisterVisitorI18n } from "./150-maleficent-sinister-visitor.i18n";

export const maleficentSinisterVisitor: CharacterCard = {
  id: "LcD",
  canonicalId: "ci_LcD",
  reprints: ["set1-150"],
  cardType: "character",
  name: "Maleficent",
  version: "Sinister Visitor",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 150,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_071ac28029b947ea8bf6b77d287ff401",
    tcgPlayer: 493493,
  },
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  i18n: maleficentSinisterVisitorI18n,
};
