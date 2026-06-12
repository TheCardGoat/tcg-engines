import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseZippingAroundI18n } from "./115-minnie-mouse-zipping-around.i18n";

export const minnieMouseZippingAround: CharacterCard = {
  id: "tsF",
  canonicalId: "ci_tsF",
  reprints: ["set2-115"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Zipping Around",
  inkType: ["ruby"],
  set: "002",
  cardNumber: 115,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_08ee7216354243869129fd8d6491168e",
    tcgPlayer: 524290,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: minnieMouseZippingAroundI18n,
};
