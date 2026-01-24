import type { CharacterCard } from "@tcg/lorcana-types";

export const anastasiaBossyStepsister: CharacterCard = {
  id: "6rw",
  cardType: "character",
  name: "Anastasia",
  version: "Bossy Stepsister",
  fullName: "Anastasia - Bossy Stepsister",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "007",
  text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "186abcc44c27815f1b4006504346a766d8731138",
  },
  abilities: [
    {
      id: "6rw-1",
      type: "action",
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
      text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
