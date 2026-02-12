import type { CharacterCard } from "@tcg/lorcana-types";

export const genieSatisfiedDragon: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "ofy-1",
      text: "BUG CATCHER During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 189,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Dragon"],
  cost: 3,
  externalIds: {
    ravensburger: "58188cff25274db6e36a6b7e5ffcb2c216184095",
  },
  franchise: "Aladdin",
  fullName: "Genie - Satisfied Dragon",
  id: "ofy",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Genie",
  set: "008",
  strength: 3,
  text: "BUG CATCHER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Satisfied Dragon",
  willpower: 4,
};
