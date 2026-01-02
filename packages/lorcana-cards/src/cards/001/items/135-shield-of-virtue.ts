import type { ItemCard } from "@tcg/lorcana-types";

export const shieldOfVirtue: ItemCard = {
  id: "f35",
  cardType: "item",
  name: "Shield of Virtue",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
  cost: 1,
  cardNumber: 135,
  inkable: true,
  externalIds: {
    ravensburger: "36603d551c1f7baf9ea15d2dc93a461dbead7c0b",
  },
  abilities: [
    {
      id: "f35-1",
      text: "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
      name: "FIREPROOF",
      type: "activated",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
};
