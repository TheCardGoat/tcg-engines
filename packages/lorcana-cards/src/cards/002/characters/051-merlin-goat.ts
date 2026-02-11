import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinGoat: CharacterCard = {
  abilities: [
    {
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
      id: "198-1",
      name: "HERE I COME! When you play this character and",
      text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "a29eca3d8c2f7e753604eac2019e1eb7a21a01b2",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Goat",
  id: "198",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Merlin",
  set: "002",
  strength: 4,
  text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
  version: "Goat",
  willpower: 3,
};
