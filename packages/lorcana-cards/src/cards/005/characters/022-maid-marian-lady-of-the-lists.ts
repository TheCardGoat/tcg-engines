import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianLadyOfTheLists: CharacterCard = {
  id: "o8f",
  cardType: "character",
  name: "Maid Marian",
  version: "Lady of the Lists",
  fullName: "Maid Marian - Lady of the Lists",
  inkType: ["amber"],
  franchise: "Robin Hood",
  set: "005",
  text: "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 22,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "57571ecd3d370c1f1730569862a57fdd14f9c28d",
  },
  abilities: [
    {
      id: "o8f-1",
      type: "triggered",
      name: "IF IT PLEASES THE LADY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_CHARACTER",
      },
      text: "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Princess"],
};
