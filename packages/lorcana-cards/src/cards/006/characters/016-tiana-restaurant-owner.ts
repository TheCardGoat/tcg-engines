import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaRestaurantOwner: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -3,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "6kc-1",
      name: "SPECIAL RESERVATION",
      text: "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "17a9503bd48a90ee1ab532c11add850dbfa48460",
  },
  franchise: "Princess and the Frog",
  fullName: "Tiana - Restaurant Owner",
  id: "6kc",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Tiana",
  set: "006",
  strength: 1,
  text: "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
  version: "Restaurant Owner",
  willpower: 4,
};
