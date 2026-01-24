import type { ItemCard } from "@tcg/lorcana-types";

export const sumerianTalisman: ItemCard = {
  id: "xe8",
  cardType: "item",
  name: "Sumerian Talisman",
  inkType: ["ruby"],
  franchise: "Ducktales",
  set: "003",
  text: "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
  cost: 3,
  cardNumber: 133,
  inkable: true,
  externalIds: {
    ravensburger: "785c3874dacb812c954b54cfba364b5a22125aa3",
  },
  abilities: [
    {
      id: "xe8-1",
      type: "triggered",
      name: "SOURCE OF MAGIC",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
    },
  ],
};
