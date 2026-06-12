import type { CharacterCard } from "@tcg/lorcana-types";
import { painImpudentImpI18n } from "./061-pain-impudent-imp.i18n";

export const painImpudentImp: CharacterCard = {
  id: "V8w",
  canonicalId: "ci_V8w",
  reprints: ["set7-061"],
  cardType: "character",
  name: "Pain",
  version: "Impudent Imp",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "007",
  cardNumber: 61,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_28105ce920e943dbb885b3a831689c38",
    tcgPlayer: 619439,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: painImpudentImpI18n,
};
