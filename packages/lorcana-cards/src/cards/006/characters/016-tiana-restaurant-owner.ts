import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaRestaurantOwner: CharacterCard = {
  id: "6kc",
  cardType: "character",
  name: "Tiana",
  version: "Restaurant Owner",
  fullName: "Tiana - Restaurant Owner",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 16,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "17a9503bd48a90ee1ab532c11add850dbfa48460",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};
