import type { CharacterCard } from "@tcg/lorcana-types";
import { sirEctorCastleLordI18n } from "./188-sir-ector-castle-lord.i18n";

export const sirEctorCastleLord: CharacterCard = {
  id: "ykg",
  canonicalId: "ci_ykg",
  reprints: ["set5-188"],
  cardType: "character",
  name: "Sir Ector",
  version: "Castle Lord",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 188,
  rarity: "rare",
  cost: 7,
  strength: 7,
  willpower: 10,
  lore: 3,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ede0bedf6d774a6db32444997ed3dccf",
    tcgPlayer: 561973,
  },
  classifications: ["Storyborn", "Knight"],
  i18n: sirEctorCastleLordI18n,
};
