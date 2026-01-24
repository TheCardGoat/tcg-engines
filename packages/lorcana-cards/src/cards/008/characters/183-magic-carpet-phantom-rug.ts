import type { CharacterCard } from "@tcg/lorcana-types";

export const magicCarpetPhantomRug: CharacterCard = {
  id: "3wd",
  cardType: "character",
  name: "Magic Carpet",
  version: "Phantom Rug",
  fullName: "Magic Carpet - Phantom Rug",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nSPECTRAL FORCE Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 183,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0e0dd82cdf94b229510d946d0e2f25817f051751",
  },
  abilities: [
    {
      id: "3wd-1",
      type: "keyword",
      keyword: "Vanish",
      text: "Vanish",
    },
    {
      id: "3wd-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 1,
      },
      name: "SPECTRAL FORCE Your other Illusion",
      text: "SPECTRAL FORCE Your other Illusion characters gain Challenger +1.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};
