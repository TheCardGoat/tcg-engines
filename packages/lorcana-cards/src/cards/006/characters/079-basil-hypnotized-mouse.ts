import type { CharacterCard } from "@tcg/lorcana-types";

export const basilHypnotizedMouse: CharacterCard = {
  abilities: [
    {
      id: "1v5-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 79,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 3,
  externalIds: {
    ravensburger: "f404642244e838db87343396d53a98cc355ec34e",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Hypnotized Mouse",
  id: "1v5",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Basil",
  set: "006",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  version: "Hypnotized Mouse",
  willpower: 2,
};
