import type { CharacterCard } from "@tcg/lorcana-types";

export const pigletSturdySwordsman: CharacterCard = {
  id: "1bb",
  cardType: "character",
  name: "Piglet",
  version: "Sturdy Swordsman",
  fullName: "Piglet - Sturdy Swordsman",
  inkType: ["steel"],
  franchise: "Winnie the Pooh",
  set: "004",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nNOT SO SMALL ANYMORE While you have no cards in your hand, this character can challenge ready characters.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 191,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "aa5bef4f5a3c18bd9740e3b9f58fa1de1b683cc0",
  },
  abilities: [
    {
      id: "1bb-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
    {
      id: "1bb-2",
      type: "static",
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      text: "NOT SO SMALL ANYMORE While you have no cards in your hand, this character can challenge ready characters.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
