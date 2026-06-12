import type { CharacterCard } from "@tcg/lorcana-types";
import { kingStefanNewFatherI18n } from "./003-king-stefan-new-father.i18n";

export const kingStefanNewFather: CharacterCard = {
  id: "156",
  canonicalId: "ci_156",
  reprints: ["set7-003"],
  cardType: "character",
  name: "King Stefan",
  version: "New Father",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "007",
  cardNumber: 3,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_45494b13fa0d45a8befe78f80312b7d9",
    tcgPlayer: 618685,
  },
  classifications: ["Storyborn", "Mentor", "King"],
  i18n: kingStefanNewFatherI18n,
};
