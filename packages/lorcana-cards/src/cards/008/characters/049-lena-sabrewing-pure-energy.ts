import type { CharacterCard } from "@tcg/lorcana-types";

export const lenaSabrewingPureEnergy: CharacterCard = {
  id: "1r9",
  cardType: "character",
  name: "Lena Sabrewing",
  version: "Pure Energy",
  fullName: "Lena Sabrewing - Pure Energy",
  inkType: ["amethyst", "steel"],
  franchise: "Ducktales",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e3f881ae99e5bc60ab1d2a05d3b024b9622ae2a9",
  },
  abilities: [
    {
      id: "1r9-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1r9-2",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "SUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
};
