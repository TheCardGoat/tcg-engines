import type { ItemCard } from "@tcg/lorcana-types";

export const vaultDoor: ItemCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      id: "1nn-1",
      text: "SEALED AWAY Your locations and characters at locations gain Resist +1.",
      type: "action",
    },
  ],
  cardNumber: 167,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "d4e40d3f6a1cb410ae20b81b5ccb4c8c6304b4ad",
  },
  franchise: "Ducktales",
  id: "1nn",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Vault Door",
  set: "003",
  text: "SEALED AWAY Your locations and characters at locations gain Resist +1. (Damage dealt to them is reduced by 1.)",
};
