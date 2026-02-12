import type { CharacterCard } from "@tcg/lorcana-types";

export const dangHuTalonChief: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
      },
      id: "tq9-1",
      name: "YOU BETTER TALK FAST Your other Villain",
      text: "YOU BETTER TALK FAST Your other Villain characters gain Support.",
      type: "static",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "6b256ace2b9933072bfb17c69e330f90bc90ae8e",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Dang Hu - Talon Chief",
  id: "tq9",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Dang Hu",
  set: "004",
  strength: 3,
  text: "YOU BETTER TALK FAST Your other Villain characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Talon Chief",
  willpower: 5,
};
