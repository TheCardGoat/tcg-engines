import type { CharacterCard } from "@tcg/lorcana-types";

export const jamesRoleModel: CharacterCard = {
  id: "1l7",
  cardType: "character",
  name: "James",
  version: "Role Model",
  fullName: "James - Role Model",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 150,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "cdf205a53c5799da903a61cbd2d7679484a1306c",
  },
  abilities: [
    {
      id: "1l7-1",
      type: "action",
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
      text: "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
