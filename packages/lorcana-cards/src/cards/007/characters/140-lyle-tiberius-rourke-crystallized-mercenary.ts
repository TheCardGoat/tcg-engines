import type { CharacterCard } from "@tcg/lorcana-types";

export const lyleTiberiusRourkeCrystallizedMercenary: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "1ug-1",
      name: "EXPLOSIVE Once",
      text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 140,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 8,
  externalIds: {
    ravensburger: "ef808ef7c1703b959b0bcb033683307dd1b4aca2",
  },
  franchise: "Atlantis",
  fullName: "Lyle Tiberius Rourke - Crystallized Mercenary",
  id: "1ug",
  inkType: ["ruby"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Lyle Tiberius Rourke",
  set: "007",
  strength: 6,
  text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
  version: "Crystallized Mercenary",
  willpower: 4,
};
