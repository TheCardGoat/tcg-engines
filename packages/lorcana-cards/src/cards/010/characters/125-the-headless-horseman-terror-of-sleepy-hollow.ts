import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanTerrorOfSleepyHollow: CharacterCard = {
  abilities: [
    {
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
      id: "171-1",
      name: "LEAVES NO TRACE",
      text: "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      id: "171-2",
      name: "GATHERING STRENGTH",
      text: "GATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 125,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "9b2717e50c4c8468b0caaee2036f07b031df02e1",
  },
  franchise: "Sleepy Hollow",
  fullName: "The Headless Horseman - Terror of Sleepy Hollow",
  id: "171",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "The Headless Horseman",
  set: "010",
  strength: 4,
  text: "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.\nGATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
  version: "Terror of Sleepy Hollow",
  willpower: 2,
};
