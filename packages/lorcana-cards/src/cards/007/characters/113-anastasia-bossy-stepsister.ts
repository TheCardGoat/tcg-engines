import type { CharacterCard } from "@tcg/lorcana-types";

export const anastasiaBossyStepsister: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
      id: "6rw-1",
      text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
      type: "action",
    },
  ],
  cardNumber: 113,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "186abcc44c27815f1b4006504346a766d8731138",
  },
  franchise: "Cinderella",
  fullName: "Anastasia - Bossy Stepsister",
  id: "6rw",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Anastasia",
  set: "007",
  strength: 3,
  text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
  version: "Bossy Stepsister",
  willpower: 1,
};
