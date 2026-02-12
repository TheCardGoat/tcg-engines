import type { CharacterCard } from "@tcg/lorcana-types";

export const rogerRadcliffeDogLover: CharacterCard = {
  abilities: [
    {
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
      id: "1t4-1",
      name: "THERE YOU GO",
      text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 5,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "eac2ac31d2370e8bb57973ee953fec1616cdcb05",
  },
  franchise: "101 Dalmatians",
  fullName: "Roger Radcliffe - Dog Lover",
  id: "1t4",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Roger Radcliffe",
  set: "007",
  strength: 1,
  text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
  version: "Dog Lover",
  willpower: 2,
};
