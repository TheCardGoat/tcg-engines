import type { ActionCard } from "@tcg/lorcana-types";

export const friendLikeMe: ActionCard = {
  abilities: [
    {
      effect: {
        type: "put-into-inkwell",
        source: "hand",
        target: "OPPONENT",
        exerted: true,
        facedown: true,
      },
      id: "h7y-1",
      text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 160,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "3e110fc0d14a46a730ef6bd4e40926b1315281b7",
  },
  franchise: "Aladdin",
  id: "h7y",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Friend Like Me",
  set: "003",
  text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
};
