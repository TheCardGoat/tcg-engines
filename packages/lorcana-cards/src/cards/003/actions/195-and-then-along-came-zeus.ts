import type { ActionCard } from "@tcg/lorcana-types";

export const andThenAlongCameZeus: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 5,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "v95-1",
      text: "Deal 5 damage to chosen character or location.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 195,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "70a43800d36d83e54f6abc028f75b80ac11dbe91",
  },
  franchise: "Hercules",
  id: "v95",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "And Then Along Came Zeus",
  set: "003",
  text: "Deal 5 damage to chosen character or location.",
};
