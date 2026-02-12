import type { ActionCard } from "@tcg/lorcana-types";

export const allFunnedOut: ActionCard = {
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "chosen-character",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "1mz-1",
      text: "Put chosen character of yours into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  cardNumber: 164,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "d155c19a7e92dc65f53ce5d529431fec5fb85353",
  },
  franchise: "Emperors New Groove",
  id: "1mz",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "All Funned Out",
  set: "005",
  text: "Put chosen character of yours into your inkwell facedown and exerted.",
};
