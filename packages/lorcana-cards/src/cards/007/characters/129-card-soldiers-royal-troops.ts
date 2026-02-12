import type { CharacterCard } from "@tcg/lorcana-types";

export const cardSoldiersRoyalTroops: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "1p8-1",
      text: "TAKE POINT While a damaged character is in play, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 129,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "dcb1ec98a56ada4be8acd345b0b77737465de130",
  },
  franchise: "Alice in Wonderland",
  fullName: "Card Soldiers - Royal Troops",
  id: "1p8",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Card Soldiers",
  set: "007",
  strength: 1,
  text: "TAKE POINT While a damaged character is in play, this character gets +2 {S}.",
  version: "Royal Troops",
  willpower: 2,
};
