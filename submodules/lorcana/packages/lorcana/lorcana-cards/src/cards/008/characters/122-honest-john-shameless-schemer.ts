import type { CharacterCard } from "@tcg/lorcana-types";
import { honestJohnShamelessSchemerI18n } from "./122-honest-john-shameless-schemer.i18n";

export const honestJohnShamelessSchemer: CharacterCard = {
  id: "P2P",
  canonicalId: "ci_P2P",
  reprints: ["set8-122"],
  cardType: "character",
  name: "Honest John",
  version: "Shameless Schemer",
  inkType: ["ruby"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 122,
  rarity: "uncommon",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2c1c280cbd8d446eb1520ac32e816f66",
    tcgPlayer: 632718,
  },
  classifications: ["Storyborn", "Villain"],
  i18n: honestJohnShamelessSchemerI18n,
};
