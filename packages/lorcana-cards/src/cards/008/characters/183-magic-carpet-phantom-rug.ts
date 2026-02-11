import type { CharacterCard } from "@tcg/lorcana-types";

export const magicCarpetPhantomRug: CharacterCard = {
  abilities: [
    {
      id: "3wd-1",
      keyword: "Vanish",
      text: "Vanish",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 1,
      },
      id: "3wd-2",
      name: "SPECTRAL FORCE Your other Illusion",
      text: "SPECTRAL FORCE Your other Illusion characters gain Challenger +1.",
      type: "static",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Illusion"],
  cost: 3,
  externalIds: {
    ravensburger: "0e0dd82cdf94b229510d946d0e2f25817f051751",
  },
  franchise: "Aladdin",
  fullName: "Magic Carpet - Phantom Rug",
  id: "3wd",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Magic Carpet",
  set: "008",
  strength: 2,
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nSPECTRAL FORCE Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
  version: "Phantom Rug",
  willpower: 4,
};
