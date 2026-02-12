import type { CharacterCard } from "@tcg/lorcana-types";

export const roxannePowerlineFan: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      id: "1w5-1",
      text: "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 113,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "f59dc3536d9dcaa73e7a35d975e4f99e5cb4c07a",
  },
  franchise: "Goofy Movie",
  fullName: "Roxanne - Powerline Fan",
  id: "1w5",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Roxanne",
  set: "009",
  strength: 2,
  text: "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
  version: "Powerline Fan",
  willpower: 3,
};
