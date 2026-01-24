import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioTalkativePuppet: CharacterCard = {
  id: "njx",
  cardType: "character",
  name: "Pinocchio",
  version: "Talkative Puppet",
  fullName: "Pinocchio - Talkative Puppet",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "TELLING LIES When you play this character, you may exert chosen opposing character.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 58,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "54e34e5ca1450807ff2d91e78c5462ae095adfd5",
  },
  abilities: [
    {
      id: "njx-1",
      type: "triggered",
      name: "TELLING LIES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "TELLING LIES When you play this character, you may exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
