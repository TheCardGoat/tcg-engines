import type { CharacterCard } from "@tcg/lorcana-types";

export const lenaSabrewingPureEnergy: CharacterCard = {
  abilities: [
    {
      id: "1r9-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
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
      id: "1r9-2",
      text: "SUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.",
      type: "action",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "e3f881ae99e5bc60ab1d2a05d3b024b9622ae2a9",
  },
  franchise: "Ducktales",
  fullName: "Lena Sabrewing - Pure Energy",
  id: "1r9",
  inkType: ["amethyst", "steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Lena Sabrewing",
  set: "008",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.",
  version: "Pure Energy",
  willpower: 3,
};
