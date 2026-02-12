import type { CharacterCard } from "@tcg/lorcana-types";

export const ichabodCraneScaredOutOfHisMind: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "1dh-1",
      name: "CHILLING TALE",
      text: "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 152,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "b25af0694982de814b9abb0e5d87fc1f3c07e581",
  },
  franchise: "Sleepy Hollow",
  fullName: "Ichabod Crane - Scared Out of His Mind",
  id: "1dh",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Ichabod Crane",
  set: "010",
  strength: 0,
  text: "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  version: "Scared Out of His Mind",
  willpower: 2,
};
