import type { CharacterCard } from "@tcg/lorcana-types";

export const lyleTiberiusRourkeCrystallizedMercenary: CharacterCard = {
  id: "1ug",
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Crystallized Mercenary",
  fullName: "Lyle Tiberius Rourke - Crystallized Mercenary",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
  cost: 8,
  strength: 6,
  willpower: 4,
  lore: 3,
  cardNumber: 140,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef808ef7c1703b959b0bcb033683307dd1b4aca2",
  },
  abilities: [
    {
      id: "1ug-1",
      type: "triggered",
      name: "EXPLOSIVE Once",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
