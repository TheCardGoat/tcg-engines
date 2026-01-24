import type { ItemCard } from "@tcg/lorcana-types";

export const potionOfMalice: ItemCard = {
  id: "ifu",
  cardType: "item",
  name: "Potion of Malice",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "010",
  text: "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.\nMINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  cardNumber: 98,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "4275816cdbb9f9296a32c10b96da37cf137ddb75",
  },
  abilities: [
    {
      id: "ifu-1",
      type: "activated",
      effect: {
        type: "put-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.",
    },
    {
      id: "ifu-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      text: "MINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn.",
    },
  ],
};
