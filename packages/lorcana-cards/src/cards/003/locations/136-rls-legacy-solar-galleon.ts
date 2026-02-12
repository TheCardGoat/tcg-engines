import type { LocationCard } from "@tcg/lorcana-types";

export const rlsLegacySolarGalleon: LocationCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
      },
      id: "1ng-1",
      name: "THIS IS OUR SHIP",
      text: "THIS IS OUR SHIP Characters gain Evasive while here.",
      type: "static",
    },
  ],
  cardNumber: 136,
  cardType: "location",
  cost: 4,
  externalIds: {
    ravensburger: "d4aef0fcfa1c528b3a1c3a7a33b1a84160fb6748",
  },
  franchise: "Treasure Planet",
  fullName: "RLS Legacy - Solar Galleon",
  id: "1ng",
  inkType: ["ruby"],
  inkable: false,
  lore: 0,
  missingImplementation: true,
  missingTests: true,
  moveCost: 3,
  name: "RLS Legacy",
  set: "003",
  text: "THIS IS OUR SHIP Characters gain Evasive while here. (Only characters with Evasive can challenge them.)\nHEAVE TOGETHER NOW If you have a character here, you pay 2 {I} less to move a character of yours here.",
  version: "Solar Galleon",
};
