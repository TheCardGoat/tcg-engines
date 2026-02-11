import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckSleepwalker: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      id: "1nl-1",
      name: "STARTLED AWAKE",
      text: "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 83,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "d6d3d90026710636cf01bb4bba63c880361772bc",
  },
  fullName: "Donald Duck - Sleepwalker",
  id: "1nl",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "009",
  strength: 0,
  text: "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.",
  version: "Sleepwalker",
  willpower: 5,
};
