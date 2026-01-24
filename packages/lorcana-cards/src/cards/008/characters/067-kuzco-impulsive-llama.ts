import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoImpulsiveLlama: CharacterCard = {
  id: "1p1",
  cardType: "character",
  name: "Kuzco",
  version: "Impulsive Llama",
  fullName: "Kuzco - Impulsive Llama",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Kuzco.)\nWHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 67,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ddaa75cc532753bc20bf3bb664f604e1eb978781",
  },
  abilities: [
    {
      id: "1p1-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1p1-2",
      type: "triggered",
      name: "WHAT DOES THIS DO?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "draw",
            amount: 1,
            target: "EACH_OPPONENT",
          },
        ],
      },
      text: "WHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
    },
  ],
  classifications: ["Floodborn", "King"],
};
