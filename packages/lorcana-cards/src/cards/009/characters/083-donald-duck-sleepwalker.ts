import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckSleepwalker: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1nl-1",
      name: "STARTLED AWAKE",
      text: "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
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
