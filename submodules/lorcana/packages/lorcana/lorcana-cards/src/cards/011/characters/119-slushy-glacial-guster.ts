import type { CharacterCard } from "@tcg/lorcana-types";
import { slushyGlacialGusterI18n } from "./119-slushy-glacial-guster.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const slushyGlacialGuster: CharacterCard = {
  id: "34k",
  canonicalId: "ci_8l8",
  reprints: ["set11-119"],
  cardType: "character",
  name: "Slushy",
  version: "Glacial Guster",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 119,
  rarity: "uncommon",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_bf26fddf7a2741a48dbe56961de6a5cb",
    tcgPlayer: 675504,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Alien"],
  abilities: [evasive],
  i18n: slushyGlacialGusterI18n,
};
