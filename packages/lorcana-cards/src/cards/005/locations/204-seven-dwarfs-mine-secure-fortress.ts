import type { LocationCard } from "@tcg/lorcana-types";

export const sevenDwarfsMineSecureFortress: LocationCard = {
  id: "135",
  cardType: "location",
  name: "Seven Dwarfs' Mine",
  version: "Secure Fortress",
  fullName: "Seven Dwarfs' Mine - Secure Fortress",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 204,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e1b0a38fb5b409a3bec3019fd820810ef7faf7a",
  },
  abilities: [
    {
      id: "135-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
    },
  ],
};
