import type { LocationCard } from "@tcg/lorcana-types";

export const theGreatIlluminaryRadiantBallroom: LocationCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHARACTERS_HERE",
      },
      id: "bsq-1",
      text: "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.",
      type: "action",
    },
  ],
  cardNumber: 169,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "2a85c33d948660b7c2e070d5eec49a5d5b4e5f30",
  },
  franchise: "Lorcana",
  fullName: "The Great Illuminary - Radiant Ballroom",
  id: "bsq",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "The Great Illuminary",
  set: "005",
  text: "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.",
  version: "Radiant Ballroom",
};
