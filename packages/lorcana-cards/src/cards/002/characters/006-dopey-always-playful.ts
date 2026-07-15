import type { CharacterCard } from "@tcg/lorcana-types";

export const dopeyAlwaysPlayful: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "7r7-1",
      name: "ODD ONE OUT",
      text: "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 6,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  cost: 3,
  externalIds: {
    ravensburger: "1bf42885e3bfca3782dbf920f153ae8a775eaa03",
  },
  franchise: "Snow White",
  fullName: "Dopey - Always Playful",
  id: "7r7",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Dopey",
  set: "002",
  strength: 2,
  text: "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
  version: "Always Playful",
  willpower: 2,
};
