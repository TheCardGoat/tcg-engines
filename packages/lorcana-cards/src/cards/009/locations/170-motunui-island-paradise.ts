import type { LocationCard } from "@tcg/lorcana-types";

export const motunuiIslandParadise: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "hand",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1ke-1",
      name: "REINCARNATION",
      text: "REINCARNATION Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "ANY_CHARACTER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 170,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "ca779946f1d6ce99fca6248ffe6424994ad3ce8c",
  },
  franchise: "Moana",
  fullName: "Motunui - Island Paradise",
  id: "1ke",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Motunui",
  set: "009",
  text: "REINCARNATION Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
  version: "Island Paradise",
};
