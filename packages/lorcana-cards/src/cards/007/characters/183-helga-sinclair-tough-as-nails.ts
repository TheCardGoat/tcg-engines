import type { CharacterCard } from "@tcg/lorcana-types";

export const helgaSinclairToughAsNails: CharacterCard = {
  id: "1ld",
  cardType: "character",
  name: "Helga Sinclair",
  version: "Tough as Nails",
  fullName: "Helga Sinclair - Tough as Nails",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "007",
  text: "Challenger +3 (While challenging, this character gets +3 {S}).\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 183,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "cec4229e674ce5edcf99772e0cc579abb664db74",
  },
  abilities: [
    {
      id: "1ld-1",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
      text: "Challenger +3.",
    },
    {
      id: "1ld-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "QUICK REFLEXES During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
