import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianLadyOfTheLists: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: -5,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "o8f-1",
      name: "IF IT PLEASES THE LADY",
      text: "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 22,
  cardType: "character",
  classifications: ["Dreamborn", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "57571ecd3d370c1f1730569862a57fdd14f9c28d",
  },
  franchise: "Robin Hood",
  fullName: "Maid Marian - Lady of the Lists",
  id: "o8f",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Maid Marian",
  set: "005",
  strength: 4,
  text: "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
  version: "Lady of the Lists",
  willpower: 5,
};
