import type { ActionCard } from "@tcg/lorcana-types";

export const maliciousMeanAndScary: ActionCard = {
  id: "bxn",
  cardType: "action",
  name: "Malicious, Mean, and Scary",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  text: "Put 1 damage counter on each opposing character.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 97,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2b0362a22d7027775ae69d67c87d57d5b1b64be3",
  },
  abilities: [
    {
      id: "bxn-1",
      type: "action",
      effect: {
        type: "put-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Put 1 damage counter on each opposing character.",
    },
  ],
};
