import type { CharacterCard } from "@tcg/lorcana-types";

export const geneNicelandResident: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "mcz-1",
      name: "I GUESS YOU EARNED THIS",
      text: "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 13,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 1,
  externalIds: {
    ravensburger: "509735c520ba2565357da084b01feb2f43038387",
  },
  franchise: "Wreck It Ralph",
  fullName: "Gene - Niceland Resident",
  id: "mcz",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gene",
  set: "008",
  strength: 1,
  text: "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.",
  version: "Niceland Resident",
  willpower: 2,
};
