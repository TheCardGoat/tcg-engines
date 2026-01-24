import type { CharacterCard } from "@tcg/lorcana-types";

export const cursedMerfolkUrsulasHandiwork: CharacterCard = {
  id: "1pi",
  cardType: "character",
  name: "Cursed Merfolk",
  version: "Ursula's Handiwork",
  fullName: "Cursed Merfolk - Ursula's Handiwork",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  text: "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 2,
  cardNumber: 71,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "ddbb33e43b310ecb59a6a51a6478e65366db0275",
  },
  abilities: [
    {
      id: "1pi-1",
      type: "triggered",
      name: "POOR SOULS",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      text: "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn"],
};
