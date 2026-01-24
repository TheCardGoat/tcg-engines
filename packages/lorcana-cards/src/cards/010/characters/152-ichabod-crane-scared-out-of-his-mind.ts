import type { CharacterCard } from "@tcg/lorcana-types";

export const ichabodCraneScaredOutOfHisMind: CharacterCard = {
  id: "1dh",
  cardType: "character",
  name: "Ichabod Crane",
  version: "Scared Out of His Mind",
  fullName: "Ichabod Crane - Scared Out of His Mind",
  inkType: ["sapphire"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  cardNumber: 152,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b25af0694982de814b9abb0e5d87fc1f3c07e581",
  },
  abilities: [
    {
      id: "1dh-1",
      type: "triggered",
      name: "CHILLING TALE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
