import type { ItemCard } from "@tcg/lorcana-types";

export const vaultDoor: ItemCard = {
  id: "1nn",
  cardType: "item",
  name: "Vault Door",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  text: "SEALED AWAY Your locations and characters at locations gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  cardNumber: 167,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4e40d3f6a1cb410ae20b81b5ccb4c8c6304b4ad",
  },
  abilities: [
    {
      id: "1nn-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 1,
      },
      text: "SEALED AWAY Your locations and characters at locations gain Resist +1.",
    },
  ],
};
