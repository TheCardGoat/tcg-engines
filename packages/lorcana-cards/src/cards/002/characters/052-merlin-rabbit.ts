import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinRabbit: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "11g-1",
      name: "HOPPITY HIP! When you play this character and",
      text: "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 52,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "870378cfa4dc54ffbdf2cb2d60a56e9cf782a4ee",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Rabbit",
  id: "11g",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Merlin",
  set: "002",
  strength: 2,
  text: "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.",
  version: "Rabbit",
  willpower: 3,
};
