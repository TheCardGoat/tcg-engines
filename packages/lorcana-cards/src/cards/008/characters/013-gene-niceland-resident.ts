import type { CharacterCard } from "@tcg/lorcana-types";

export const geneNicelandResident: CharacterCard = {
  id: "mcz",
  cardType: "character",
  name: "Gene",
  version: "Niceland Resident",
  fullName: "Gene - Niceland Resident",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "008",
  text: "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 13,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "509735c520ba2565357da084b01feb2f43038387",
  },
  abilities: [
    {
      id: "mcz-1",
      type: "triggered",
      name: "I GUESS YOU EARNED THIS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
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
      text: "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn"],
};
