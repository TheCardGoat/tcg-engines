import type { ActionCard } from "@tcg/lorcana-types";

export const suddenScare: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "put-into-inkwell",
            source: "chosen-character",
            target: "OPPONENT",
            facedown: true,
          },
          {
            type: "put-into-inkwell",
            source: "hand",
            target: "OPPONENT",
            facedown: true,
          },
        ],
        type: "sequence",
      },
      id: "1jz-1",
      text: "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.",
      type: "action",
    },
  ],
  cardNumber: 164,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "c9c19bc296c45f9f2cf3a8a71eb66d92d93fab92",
  },
  id: "1jz",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Sudden Scare",
  set: "010",
  text: "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.",
};
