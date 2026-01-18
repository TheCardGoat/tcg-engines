import type { ActionCard } from "@tcg/lorcana-types";

export const makeThePotion: ActionCard = {
  id: "db6",
  cardType: "action",
  name: "Make the Potion",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "009",
  text: "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.",
  cost: 2,
  cardNumber: 98,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ff92870c51a6d0ed82d95f43850abf04ef72c3d",
  },
  abilities: [],
};
