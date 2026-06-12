import type { CharacterCard } from "@tcg/lorcana-types";
import { sirKayUnrulyKnightI18n } from "./144-sir-kay-unruly-knight.i18n";

export const sirKayUnrulyKnight: CharacterCard = {
  id: "1bB",
  canonicalId: "ci_1bB",
  reprints: ["set7-144"],
  cardType: "character",
  name: "Sir Kay",
  version: "Unruly Knight",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "007",
  cardNumber: 144,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ff5d1835b81b400cac7373fb6310ca6a",
    tcgPlayer: 619488,
  },
  classifications: ["Storyborn", "Knight"],
  i18n: sirKayUnrulyKnightI18n,
};
