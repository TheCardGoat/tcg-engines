import type { CharacterCard } from "@tcg/lorcana-types";

export const bagheeraGuardianJaguar: CharacterCard = {
  id: "132",
  cardType: "character",
  name: "Bagheera",
  version: "Guardian Jaguar",
  fullName: "Bagheera - Guardian Jaguar",
  inkType: ["steel"],
  franchise: "Jungle Book",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nYOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 198,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e707e6dd19e262dc08b7529a727f0a41a77b507",
  },
  abilities: [
    {
      id: "132-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "132-2",
      type: "triggered",
      name: "YOU MUST BE BRAVE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "YOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
