import type { CharacterCard } from "@tcg/lorcana-types";

export const genieSatisfiedDragon: CharacterCard = {
  id: "ofy",
  cardType: "character",
  name: "Genie",
  version: "Satisfied Dragon",
  fullName: "Genie - Satisfied Dragon",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  text: "BUG CATCHER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 189,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "58188cff25274db6e36a6b7e5ffcb2c216184095",
  },
  abilities: [
    {
      id: "ofy-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "BUG CATCHER During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
};
