import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinRabbit: CharacterCard = {
  id: "11g",
  cardType: "character",
  name: "Merlin",
  version: "Rabbit",
  fullName: "Merlin - Rabbit",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 52,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "870378cfa4dc54ffbdf2cb2d60a56e9cf782a4ee",
  },
  abilities: [
    {
      id: "11g-1",
      type: "triggered",
      name: "HOPPITY HIP! When you play this character and",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
