import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraPirateChief: CharacterCard = {
  id: "15x",
  cardType: "character",
  name: "Kakamora",
  version: "Pirate Chief",
  fullName: "Kakamora - Pirate Chief",
  inkType: ["steel"],
  franchise: "Moana",
  set: "006",
  text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 172,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "97266efddadb85c14ed91903802d893795b7d75a",
  },
  abilities: [
    {
      id: "15x-1",
      type: "triggered",
      name: "COCONUT LEADER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "choice",
        options: [
          {
            type: "deal-damage",
            amount: 1,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "deal-damage",
            amount: 3,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
        optionLabels: [
          "you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character",
          "location. If a Pirate character card was discarded, deal 3 damage to that character",
        ],
      },
      text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
    },
  ],
  classifications: ["Storyborn", "Pirate", "Captain"],
};
