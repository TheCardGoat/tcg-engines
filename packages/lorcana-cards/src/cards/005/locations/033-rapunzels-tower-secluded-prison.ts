import type { LocationCard } from "@tcg/lorcana-types";

export const rapunzelsTowerSecludedPrison: LocationCard = {
  id: "vng",
  cardType: "location",
  name: "Rapunzel's Tower",
  version: "Secluded Prison",
  fullName: "Rapunzel's Tower - Secluded Prison",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "005",
  text: "SAFE AND SOUND Characters get +3 {W} while here.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 33,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "721302a46297cf79785076ab9ef5df9ac536389d",
  },
  abilities: [
    {
      id: "vng-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 3,
        target: "CHARACTERS_HERE",
      },
      name: "SAFE AND SOUND",
      text: "SAFE AND SOUND Characters get +3 {W} while here.",
    },
  ],
};
