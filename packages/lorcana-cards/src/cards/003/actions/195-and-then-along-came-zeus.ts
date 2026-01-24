import type { ActionCard } from "@tcg/lorcana-types";

export const andThenAlongCameZeus: ActionCard = {
  id: "v95",
  cardType: "action",
  name: "And Then Along Came Zeus",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  text: "Deal 5 damage to chosen character or location.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 195,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "70a43800d36d83e54f6abc028f75b80ac11dbe91",
  },
  abilities: [
    {
      id: "v95-1",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 5,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Deal 5 damage to chosen character or location.",
    },
  ],
};
