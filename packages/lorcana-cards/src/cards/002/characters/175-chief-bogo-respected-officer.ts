import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoRespectedOfficer: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "1q6-1",
      name: "INSUBORDINATION!",
      text: "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 175,
  cardType: "character",
  classifications: ["Dreamborn"],
  cost: 4,
  externalIds: {
    ravensburger: "e2241ad74c9e4ea143116d7866417f72982e755c",
  },
  franchise: "Zootropolis",
  fullName: "Chief Bogo - Respected Officer",
  id: "1q6",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Chief Bogo",
  set: "002",
  strength: 2,
  text: "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
  version: "Respected Officer",
  willpower: 4,
};
