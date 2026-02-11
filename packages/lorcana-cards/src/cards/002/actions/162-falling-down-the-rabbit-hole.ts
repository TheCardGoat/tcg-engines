import type { ActionCard } from "@tcg/lorcana-types";

export const fallingDownTheRabbitHole: ActionCard = {
  abilities: [
    {
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "OPPONENT",
        exerted: true,
        facedown: true,
      },
      id: "iug-1",
      text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
      type: "action",
    },
  ],
  cardNumber: 162,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "43ec3764557b471a737bf6e14efe6af0e840d0f8",
  },
  franchise: "Alice in Wonderland",
  id: "iug",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Falling Down the Rabbit Hole",
  set: "002",
  text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
};
