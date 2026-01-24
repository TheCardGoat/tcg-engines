import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanTerrorOfSleepyHollow: CharacterCard = {
  id: "171",
  cardType: "character",
  name: "The Headless Horseman",
  version: "Terror of Sleepy Hollow",
  fullName: "The Headless Horseman - Terror of Sleepy Hollow",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.\nGATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 2,
  cardNumber: 125,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9b2717e50c4c8468b0caaee2036f07b031df02e1",
  },
  abilities: [
    {
      id: "171-1",
      type: "triggered",
      name: "LEAVES NO TRACE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.",
    },
    {
      id: "171-2",
      type: "triggered",
      name: "GATHERING STRENGTH",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "GATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
