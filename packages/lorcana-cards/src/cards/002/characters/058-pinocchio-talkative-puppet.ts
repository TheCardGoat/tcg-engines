import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioTalkativePuppet: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "njx-1",
      name: "TELLING LIES",
      text: "TELLING LIES When you play this character, you may exert chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "54e34e5ca1450807ff2d91e78c5462ae095adfd5",
  },
  franchise: "Pinocchio",
  fullName: "Pinocchio - Talkative Puppet",
  id: "njx",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Pinocchio",
  set: "002",
  strength: 1,
  text: "TELLING LIES When you play this character, you may exert chosen opposing character.",
  version: "Talkative Puppet",
  willpower: 1,
};
