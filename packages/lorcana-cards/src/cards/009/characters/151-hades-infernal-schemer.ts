import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesInfernalSchemer: CharacterCard = {
  id: "12a",
  cardType: "character",
  name: "Hades",
  version: "Infernal Schemer",
  fullName: "Hades - Infernal Schemer",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "009",
  text: "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 151,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "89f9ee7889da4ebacb49419bd4b8dae4220a5c7c",
  },
  abilities: [
    {
      id: "12a-1",
      type: "triggered",
      name: "IS THERE A DOWNSIDE TO THIS?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-character",
          target: "OPPONENT",
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
};
