import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarHighSultanOfLorcana: CharacterCard = {
  id: "mfw",
  cardType: "character",
  name: "Jafar",
  version: "High Sultan of Lorcana",
  fullName: "Jafar - High Sultan of Lorcana",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "008",
  text: "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 3,
  cardNumber: 74,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "50e1c204657b785ab5879cee057fe3009115fd88",
  },
  abilities: [
    {
      id: "mfw-1",
      type: "triggered",
      name: "DARK POWER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an Illusion character card is discarded this way",
        },
        then: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
      },
      text: "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "King", "Sorcerer"],
};
