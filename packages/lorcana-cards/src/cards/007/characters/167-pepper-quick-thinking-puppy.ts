import type { CharacterCard } from "@tcg/lorcana-types";

export const pepperQuickthinkingPuppy: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "15w-1",
      name: "IN THE NICK OF TIME",
      text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 167,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 3,
  externalIds: {
    ravensburger: "97098c501f90935ba737140dca7ffd730fac352d",
  },
  franchise: "101 Dalmatians",
  fullName: "Pepper - Quick-Thinking Puppy",
  id: "15w",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pepper",
  set: "007",
  strength: 2,
  text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
  version: "Quick-Thinking Puppy",
  willpower: 2,
};
