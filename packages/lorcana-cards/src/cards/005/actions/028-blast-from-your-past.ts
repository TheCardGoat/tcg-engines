import type { ActionCard } from "@tcg/lorcana-types";

export const blastFromYourPast: ActionCard = {
  id: "1tj",
  cardType: "action",
  name: "Blast from Your Past",
  inkType: ["amber"],
  franchise: "Aladdin",
  set: "005",
  text: "Name a card. Return all character cards with that name from your discard to your hand.",
  actionSubtype: "song",
  cost: 6,
  cardNumber: 28,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "eae624b967b48ff127a57526529e8f65e7e8db5e",
  },
  abilities: [
    {
      id: "1tj-1",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Name a card. Return all character cards with that name from your discard to your hand.",
    },
  ],
};
