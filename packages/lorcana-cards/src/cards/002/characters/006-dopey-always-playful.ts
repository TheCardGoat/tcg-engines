import type { CharacterCard } from "@tcg/lorcana-types";

export const dopeyAlwaysPlayful: CharacterCard = {
  id: "7r7",
  cardType: "character",
  name: "Dopey",
  version: "Always Playful",
  fullName: "Dopey - Always Playful",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1bf42885e3bfca3782dbf920f153ae8a775eaa03",
  },
  abilities: [
    {
      id: "7r7-1",
      type: "triggered",
      name: "ODD ONE OUT",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
      text: "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};
