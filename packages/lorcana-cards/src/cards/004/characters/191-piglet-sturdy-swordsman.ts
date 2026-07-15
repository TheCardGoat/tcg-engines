import type { CharacterCard } from "@tcg/lorcana-types";

export const pigletSturdySwordsman: CharacterCard = {
  abilities: [
    {
      id: "1bb-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        ability: "can-challenge-ready",
        target: "SELF",
        type: "grant-ability",
      },
      id: "1bb-2",
      text: "NOT SO SMALL ANYMORE While you have no cards in your hand, this character can challenge ready characters.",
      type: "static",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "aa5bef4f5a3c18bd9740e3b9f58fa1de1b683cc0",
  },
  franchise: "Winnie the Pooh",
  fullName: "Piglet - Sturdy Swordsman",
  id: "1bb",
  inkType: ["steel"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Piglet",
  set: "004",
  strength: 3,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nNOT SO SMALL ANYMORE While you have no cards in your hand, this character can challenge ready characters.",
  version: "Sturdy Swordsman",
  willpower: 5,
};
