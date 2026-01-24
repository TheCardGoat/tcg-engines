import type { CharacterCard } from "@tcg/lorcana-types";

export const camiloMadrigalFamilyCopycat: CharacterCard = {
  id: "1ra",
  cardType: "character",
  name: "Camilo Madrigal",
  version: "Family Copycat",
  fullName: "Camilo Madrigal - Family Copycat",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "005",
  text: "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 1,
  cardNumber: 58,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4d5e8f774c50c619ff2d88974512f4e419a3b3c",
  },
  abilities: [
    {
      id: "1ra-1",
      type: "triggered",
      name: "IMITATE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
