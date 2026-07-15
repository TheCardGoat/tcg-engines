import type { CharacterCard } from "@tcg/lorcana-types";

export const cursedMerfolkUrsulasHandiwork: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1pi-1",
      name: "POOR SOULS",
      text: "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 71,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 1,
  externalIds: {
    ravensburger: "ddbb33e43b310ecb59a6a51a6478e65366db0275",
  },
  franchise: "Little Mermaid",
  fullName: "Cursed Merfolk - Ursula's Handiwork",
  id: "1pi",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Cursed Merfolk",
  set: "009",
  strength: 0,
  text: "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.",
  version: "Ursula's Handiwork",
  willpower: 1,
};
