import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoImpulsiveLlama: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1p1-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        steps: [
          {
            from: "hand",
            type: "play-card",
          },
          {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1p1-2",
      name: "WHAT DOES THIS DO?",
      text: "WHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 67,
  cardType: "character",
  classifications: ["Floodborn", "King"],
  cost: 7,
  externalIds: {
    ravensburger: "ddaa75cc532753bc20bf3bb664f604e1eb978781",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco - Impulsive Llama",
  id: "1p1",
  inkType: ["amethyst", "emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Kuzco",
  set: "008",
  strength: 5,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Kuzco.)\nWHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
  version: "Impulsive Llama",
  willpower: 5,
};
