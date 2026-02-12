import type { CharacterCard } from "@tcg/lorcana-types";

export const rogerRadcliffeDogLover: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "1t4-1",
      name: "THERE YOU GO",
      text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
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
