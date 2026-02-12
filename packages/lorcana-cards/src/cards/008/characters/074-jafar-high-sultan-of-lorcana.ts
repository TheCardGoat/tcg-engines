import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarHighSultanOfLorcana: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "an Illusion character card is discarded this way",
          type: "if",
        },
        then: {
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "mfw-1",
      name: "DARK POWER",
      text: "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "King", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "50e1c204657b785ab5879cee057fe3009115fd88",
  },
  franchise: "Aladdin",
  fullName: "Jafar - High Sultan of Lorcana",
  id: "mfw",
  inkType: ["amethyst", "steel"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Jafar",
  set: "008",
  strength: 4,
  text: "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
  version: "High Sultan of Lorcana",
  willpower: 4,
};
