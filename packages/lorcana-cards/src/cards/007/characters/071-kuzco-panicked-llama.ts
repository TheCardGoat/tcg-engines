import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoPanickedLlama: CharacterCard = {
  abilities: [
    {
      id: "5gj-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
      id: "5gj-3",
      text: "• Each player draws a card.",
      type: "action",
    },
    {
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_PLAYER",
        chosen: true,
      },
      id: "5gj-4",
      text: "• Each player chooses and discards a card.",
      type: "action",
    },
  ],
  cardNumber: 71,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 4,
  externalIds: {
    ravensburger: "13ad1b826bfa0c021406dce75ac9d15ecaf5669a",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco - Panicked Llama",
  id: "5gj",
  inkType: ["amethyst", "emerald"],
  inkable: false,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Kuzco",
  set: "007",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWE CAN FIGURE THIS OUT At the start of your turn, choose one: \n• Each player draws a card. \n• Each player chooses and discards a card.",
  version: "Panicked Llama",
  willpower: 2,
};
