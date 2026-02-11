import type { ItemCard } from "@tcg/lorcana-types";

export const theSwordOfShanyu: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      id: "1wb-1",
      text: "WORTHY WEAPON {E}, {E} one of your characters — Ready chosen character. They can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  cardNumber: 152,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "f53cefd9fc2611fc223d96dff8640a4eeaf9068d",
  },
  franchise: "Mulan",
  id: "1wb",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "The Sword of Shan-Yu",
  set: "008",
  text: "WORTHY WEAPON {E}, {E} one of your characters — Ready chosen character. They can't quest for the rest of this turn.",
};
