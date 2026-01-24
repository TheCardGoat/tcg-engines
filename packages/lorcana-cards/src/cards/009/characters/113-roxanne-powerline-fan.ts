import type { CharacterCard } from "@tcg/lorcana-types";

export const roxannePowerlineFan: CharacterCard = {
  id: "1w5",
  cardType: "character",
  name: "Roxanne",
  version: "Powerline Fan",
  fullName: "Roxanne - Powerline Fan",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 113,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f59dc3536d9dcaa73e7a35d975e4f99e5cb4c07a",
  },
  abilities: [
    {
      id: "1w5-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
