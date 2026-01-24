import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinGoat: CharacterCard = {
  id: "198",
  cardType: "character",
  name: "Merlin",
  version: "Goat",
  fullName: "Merlin - Goat",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 51,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a29eca3d8c2f7e753604eac2019e1eb7a21a01b2",
  },
  abilities: [
    {
      id: "198-1",
      type: "triggered",
      name: "HERE I COME! When you play this character and",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
