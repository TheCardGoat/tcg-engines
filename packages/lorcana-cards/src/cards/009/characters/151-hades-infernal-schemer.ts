import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesInfernalSchemer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-character",
          target: "OPPONENT",
          facedown: true,
        },
        type: "optional",
      },
      id: "12a-1",
      name: "IS THERE A DOWNSIDE TO THIS?",
      text: "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 151,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Deity"],
  cost: 7,
  externalIds: {
    ravensburger: "89f9ee7889da4ebacb49419bd4b8dae4220a5c7c",
  },
  franchise: "Hercules",
  fullName: "Hades - Infernal Schemer",
  id: "12a",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Hades",
  set: "009",
  strength: 3,
  text: "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
  version: "Infernal Schemer",
  willpower: 6,
};
