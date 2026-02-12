import type { CharacterCard } from "@tcg/lorcana-types";

export const helgaSinclairToughAsNails: CharacterCard = {
  abilities: [
    {
      id: "1ld-1",
      keyword: "Challenger",
      text: "Challenger +3.",
      type: "keyword",
      value: 3,
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "1ld-2",
      text: "QUICK REFLEXES During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "cec4229e674ce5edcf99772e0cc579abb664db74",
  },
  franchise: "Atlantis",
  fullName: "Helga Sinclair - Tough as Nails",
  id: "1ld",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Helga Sinclair",
  set: "007",
  strength: 0,
  text: "Challenger +3 (While challenging, this character gets +3 {S}).\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Tough as Nails",
  willpower: 4,
};
