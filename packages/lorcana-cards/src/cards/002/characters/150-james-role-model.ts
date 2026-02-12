import type { CharacterCard } from "@tcg/lorcana-types";

export const jamesRoleModel: CharacterCard = {
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
      id: "1l7-1",
      text: "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  cardNumber: 150,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 4,
  externalIds: {
    ravensburger: "cdf205a53c5799da903a61cbd2d7679484a1306c",
  },
  franchise: "Princess and the Frog",
  fullName: "James - Role Model",
  id: "1l7",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "James",
  set: "002",
  strength: 3,
  text: "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.",
  version: "Role Model",
  willpower: 3,
};
