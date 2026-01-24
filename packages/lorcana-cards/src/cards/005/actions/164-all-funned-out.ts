import type { ActionCard } from "@tcg/lorcana-types";

export const allFunnedOut: ActionCard = {
  id: "1mz",
  cardType: "action",
  name: "All Funned Out",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Put chosen character of yours into your inkwell facedown and exerted.",
  cost: 1,
  cardNumber: 164,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d155c19a7e92dc65f53ce5d529431fec5fb85353",
  },
  abilities: [
    {
      id: "1mz-1",
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "Put chosen character of yours into your inkwell facedown and exerted.",
    },
  ],
};
