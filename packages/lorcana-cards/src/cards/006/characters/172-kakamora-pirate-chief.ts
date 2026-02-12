import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraPirateChief: CharacterCard = {
  abilities: [
    {
      effect: {
        optionLabels: [
          "you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character",
          "location. If a Pirate character card was discarded, deal 3 damage to that character",
        ],
        options: [
          {
            amount: 1,
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "deal-damage",
          },
          {
            amount: 3,
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "deal-damage",
          },
        ],
        type: "choice",
      },
      id: "15x-1",
      name: "COCONUT LEADER",
      text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 172,
  cardType: "character",
  classifications: ["Storyborn", "Pirate", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "97266efddadb85c14ed91903802d893795b7d75a",
  },
  franchise: "Moana",
  fullName: "Kakamora - Pirate Chief",
  id: "15x",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Kakamora",
  set: "006",
  strength: 4,
  text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
  version: "Pirate Chief",
  willpower: 6,
};
