import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinShapeshifter: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      id: "fck-1",
      name: "BATTLE OF WITS",
      text: "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "3751caafb6f13697fa71e20453c85eabe3a49ed4",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Shapeshifter",
  id: "fck",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Merlin",
  set: "002",
  strength: 1,
  text: "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
  version: "Shapeshifter",
  willpower: 5,
};
