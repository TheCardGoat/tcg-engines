import type { ItemCard } from "@tcg/lorcana-types";

export const potionOfMalice: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "put-damage",
      },
      id: "ifu-1",
      text: "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.",
      type: "activated",
    },
    {
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "ifu-2",
      text: "MINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 98,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "4275816cdbb9f9296a32c10b96da37cf137ddb75",
  },
  franchise: "Hercules",
  id: "ifu",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Potion of Malice",
  set: "010",
  text: "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.\nMINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
};
