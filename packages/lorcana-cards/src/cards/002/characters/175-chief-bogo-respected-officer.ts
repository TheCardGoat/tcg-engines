import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoRespectedOfficer: CharacterCard = {
  id: "1q6",
  cardType: "character",
  name: "Chief Bogo",
  version: "Respected Officer",
  fullName: "Chief Bogo - Respected Officer",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "002",
  text: "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 175,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e2241ad74c9e4ea143116d7866417f72982e755c",
  },
  abilities: [
    {
      id: "1q6-1",
      type: "triggered",
      name: "INSUBORDINATION!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
    },
  ],
  classifications: ["Dreamborn"],
};
