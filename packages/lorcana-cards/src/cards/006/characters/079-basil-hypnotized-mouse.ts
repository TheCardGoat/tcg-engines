import type { CharacterCard } from "@tcg/lorcana";

export const basilHypnotizedMouse: CharacterCard = {
  id: "1v9",
  cardType: "character",
  name: "Basil",
  version: "Hypnotized Mouse",
  fullName: "Basil - Hypnotized Mouse",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "079",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "f404642244e838db87343396d53a98cc355ec34e",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1v9a1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
