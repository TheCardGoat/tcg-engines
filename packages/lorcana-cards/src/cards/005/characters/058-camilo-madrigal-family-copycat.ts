import type { CharacterCard } from "@tcg/lorcana-types";

export const camiloMadrigalFamilyCopycat: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "1ra-1",
      name: "IMITATE",
      text: "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 6,
  externalIds: {
    ravensburger: "e4d5e8f774c50c619ff2d88974512f4e419a3b3c",
  },
  franchise: "Encanto",
  fullName: "Camilo Madrigal - Family Copycat",
  id: "1ra",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Camilo Madrigal",
  set: "005",
  strength: 3,
  text: "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
  version: "Family Copycat",
  willpower: 7,
};
