import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckSleepwalker: CharacterCard = {
  id: "1nl",
  cardType: "character",
  name: "Donald Duck",
  version: "Sleepwalker",
  fullName: "Donald Duck - Sleepwalker",
  inkType: ["emerald"],
  set: "009",
  text: "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 1,
  cardNumber: 83,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d6d3d90026710636cf01bb4bba63c880361772bc",
  },
  abilities: [
    {
      id: "1nl-1",
      type: "triggered",
      name: "STARTLED AWAKE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      text: "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn"],
};
