import type { CharacterCard } from "@tcg/lorcana-types";

export const bagheeraGuardianJaguar: CharacterCard = {
  abilities: [
    {
      id: "132-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "132-2",
      name: "YOU MUST BE BRAVE",
      text: "YOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 198,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "8e707e6dd19e262dc08b7529a727f0a41a77b507",
  },
  franchise: "Jungle Book",
  fullName: "Bagheera - Guardian Jaguar",
  id: "132",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Bagheera",
  set: "007",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nYOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
  version: "Guardian Jaguar",
  willpower: 3,
};
