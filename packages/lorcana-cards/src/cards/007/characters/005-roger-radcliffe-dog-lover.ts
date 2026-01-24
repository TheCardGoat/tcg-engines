import type { CharacterCard } from "@tcg/lorcana-types";

export const rogerRadcliffeDogLover: CharacterCard = {
  id: "1t4",
  cardType: "character",
  name: "Roger Radcliffe",
  version: "Dog Lover",
  fullName: "Roger Radcliffe - Dog Lover",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 5,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "eac2ac31d2370e8bb57973ee953fec1616cdcb05",
  },
  abilities: [
    {
      id: "1t4-1",
      type: "triggered",
      name: "THERE YOU GO",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
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
      text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
