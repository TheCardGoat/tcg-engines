import type { CharacterCard } from "@tcg/lorcana-types";

export const ludwigVonDrakeAllaroundExpert: CharacterCard = {
  abilities: [
    {
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
      id: "1c5-2",
      name: "LASTING LEGACY",
      text: "LASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 7,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "ad987e8ceb30c109d82e7245edd9c0a4d8d95146",
  },
  fullName: "Ludwig Von Drake - All-Around Expert",
  id: "1c5",
  inkType: ["amber", "sapphire"],
  inkable: false,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Ludwig Von Drake",
  set: "008",
  strength: 1,
  text: "SUPERIOR MIND When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.\nLASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.",
  version: "All-Around Expert",
  willpower: 1,
};
