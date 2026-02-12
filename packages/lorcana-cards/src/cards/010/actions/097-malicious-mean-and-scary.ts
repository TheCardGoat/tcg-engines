import type { ActionCard } from "@tcg/lorcana-types";

export const maliciousMeanAndScary: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "put-damage",
      },
      id: "bxn-1",
      text: "Put 1 damage counter on each opposing character.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 97,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "2b0362a22d7027775ae69d67c87d57d5b1b64be3",
  },
  franchise: "Tangled",
  id: "bxn",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Malicious, Mean, and Scary",
  set: "010",
  text: "Put 1 damage counter on each opposing character.",
};
