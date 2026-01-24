import type { CharacterCard } from "@tcg/lorcana-types";

export const pepperQuickthinkingPuppy: CharacterCard = {
  id: "15w",
  cardType: "character",
  name: "Pepper",
  version: "Quick-Thinking Puppy",
  fullName: "Pepper - Quick-Thinking Puppy",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 167,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "97098c501f90935ba737140dca7ffd730fac352d",
  },
  abilities: [
    {
      id: "15w-1",
      type: "triggered",
      name: "IN THE NICK OF TIME",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
};
