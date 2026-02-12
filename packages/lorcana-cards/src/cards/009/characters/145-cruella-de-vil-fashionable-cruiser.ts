import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilFashionableCruiser: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "g1s-1",
      text: "NOW GET GOING During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 145,
  cardType: "character",
  classifications: ["Dreamborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "39d81f72fb13e512ea913ac8dd9ab95f2688be81",
  },
  franchise: "101 Dalmatians",
  fullName: "Cruella De Vil - Fashionable Cruiser",
  id: "g1s",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cruella De Vil",
  set: "009",
  strength: 3,
  text: "NOW GET GOING During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Fashionable Cruiser",
  willpower: 2,
};
