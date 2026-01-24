import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoPanickedLlama: CharacterCard = {
  id: "5gj",
  cardType: "character",
  name: "Kuzco",
  version: "Panicked Llama",
  fullName: "Kuzco - Panicked Llama",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWE CAN FIGURE THIS OUT At the start of your turn, choose one: \n• Each player draws a card. \n• Each player chooses and discards a card.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 71,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "13ad1b826bfa0c021406dce75ac9d15ecaf5669a",
  },
  abilities: [
    {
      id: "5gj-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "5gj-3",
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
      text: "• Each player draws a card.",
    },
    {
      id: "5gj-4",
      type: "action",
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_PLAYER",
        chosen: true,
      },
      text: "• Each player chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "King"],
};
