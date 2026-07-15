import type { ActionCard } from "@tcg/lorcana-types";

export const blastFromYourPast: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "any",
          selector: "all",
          zones: ["play"],
        },
        type: "return-to-hand",
      },
      id: "1tj-1",
      text: "Name a card. Return all character cards with that name from your discard to your hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 28,
  cardType: "action",
  cost: 6,
  externalIds: {
    ravensburger: "eae624b967b48ff127a57526529e8f65e7e8db5e",
  },
  franchise: "Aladdin",
  id: "1tj",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Blast from Your Past",
  set: "005",
  text: "Name a card. Return all character cards with that name from your discard to your hand.",
};
