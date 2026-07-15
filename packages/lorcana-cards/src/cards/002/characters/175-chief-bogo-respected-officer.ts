import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoRespectedOfficer: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1q6-1",
      name: "INSUBORDINATION!",
      text: "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
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
