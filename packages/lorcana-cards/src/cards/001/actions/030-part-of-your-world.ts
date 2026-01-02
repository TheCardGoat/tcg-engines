import type { ActionCard } from "@tcg/lorcana-types";

export const partOfYourWorld: ActionCard = {
  id: "fn0",
  cardType: "action",
  name: "Part of Your World",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Return a character card from your discard to your hand.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 30,
  inkable: false,
  externalIds: {
    ravensburger: "385d2d6b1f6d4093408da9cd744c87865c9a538b",
  },
  abilities: [
    {
      id: "fn0-1",
      text: "Return a character card from your discard to your hand.",
      type: "action",
      effect: {
        type: "return-from-discard",
        cardType: "character",
        target: "CONTROLLER",
      },
    },
  ],
};
