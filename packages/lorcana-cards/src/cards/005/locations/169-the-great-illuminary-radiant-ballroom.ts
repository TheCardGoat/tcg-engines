import type { LocationCard } from "@tcg/lorcana-types";

export const theGreatIlluminaryRadiantBallroom: LocationCard = {
  id: "bsq",
  cardType: "location",
  name: "The Great Illuminary",
  version: "Radiant Ballroom",
  fullName: "The Great Illuminary - Radiant Ballroom",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "005",
  text: "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.",
  cost: 3,
  moveCost: 2,
  lore: 0,
  cardNumber: 169,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2a85c33d948660b7c2e070d5eec49a5d5b4e5f30",
  },
  abilities: [
    {
      id: "bsq-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHARACTERS_HERE",
      },
      text: "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.",
    },
  ],
};
