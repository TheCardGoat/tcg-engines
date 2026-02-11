import type { LocationCard } from "@tcg/lorcana-types";

export const rapunzelsTowerSecludedPrison: LocationCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 3,
        target: "CHARACTERS_HERE",
      },
      id: "vng-1",
      name: "SAFE AND SOUND",
      text: "SAFE AND SOUND Characters get +3 {W} while here.",
      type: "static",
    },
  ],
  cardNumber: 33,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "721302a46297cf79785076ab9ef5df9ac536389d",
  },
  franchise: "Tangled",
  fullName: "Rapunzel's Tower - Secluded Prison",
  id: "vng",
  inkType: ["amber"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Rapunzel's Tower",
  set: "005",
  text: "SAFE AND SOUND Characters get +3 {W} while here.",
  version: "Secluded Prison",
};
