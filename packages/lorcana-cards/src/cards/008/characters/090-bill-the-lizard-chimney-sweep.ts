import type { CharacterCard } from "@tcg/lorcana-types";

export const billTheLizardChimneySweep: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "tc2-1",
      text: "NOTHING TO IT While another character in play has damage, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 1,
  externalIds: {
    ravensburger: "69b9facbf15d57278b8ed4a2118c589d75a4b24f",
  },
  franchise: "Alice in Wonderland",
  fullName: "Bill the Lizard - Chimney Sweep",
  id: "tc2",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Bill the Lizard",
  set: "008",
  strength: 1,
  text: "NOTHING TO IT While another character in play has damage, this character gains Evasive. (Only characters with Evasive can challenge them.)",
  version: "Chimney Sweep",
  willpower: 2,
};
