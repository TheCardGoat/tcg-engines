import type { ItemCard } from "@tcg/lorcana-types";

export const sumerianTalisman: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "xe8-1",
      name: "SOURCE OF MAGIC",
      text: "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 133,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "785c3874dacb812c954b54cfba364b5a22125aa3",
  },
  franchise: "Ducktales",
  id: "xe8",
  inkType: ["ruby"],
  inkable: true,
  name: "Sumerian Talisman",
  set: "003",
  text: "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
};
