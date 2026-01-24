import type { ActionCard } from "@tcg/lorcana-types";

export const fallingDownTheRabbitHole: ActionCard = {
  id: "iug",
  cardType: "action",
  name: "Falling Down the Rabbit Hole",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
  cost: 4,
  cardNumber: 162,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "43ec3764557b471a737bf6e14efe6af0e840d0f8",
  },
  abilities: [
    {
      id: "iug-1",
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "OPPONENT",
        exerted: true,
        facedown: true,
      },
      text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
    },
  ],
};
