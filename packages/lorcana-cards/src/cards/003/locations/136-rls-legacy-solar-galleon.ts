import type { LocationCard } from "@tcg/lorcana-types";

export const rlsLegacySolarGalleon: LocationCard = {
  id: "1ng",
  cardType: "location",
  name: "RLS Legacy",
  version: "Solar Galleon",
  fullName: "RLS Legacy - Solar Galleon",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  text: "THIS IS OUR SHIP Characters gain Evasive while here. (Only characters with Evasive can challenge them.)\nHEAVE TOGETHER NOW If you have a character here, you pay 2 {I} less to move a character of yours here.",
  cost: 4,
  moveCost: 3,
  lore: 0,
  cardNumber: 136,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4aef0fcfa1c528b3a1c3a7a33b1a84160fb6748",
  },
  abilities: [
    {
      id: "1ng-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        // @ts-expect-error - CHARACTERS_HERE needs special location handling
        target: "CHARACTERS_HERE",
      },
      name: "THIS IS OUR SHIP",
      text: "THIS IS OUR SHIP Characters gain Evasive while here.",
    },
  ],
};
