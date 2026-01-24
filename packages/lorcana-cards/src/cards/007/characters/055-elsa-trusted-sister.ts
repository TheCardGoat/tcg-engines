import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaTrustedSister: CharacterCard = {
  id: "yr0",
  cardType: "character",
  name: "Elsa",
  version: "Trusted Sister",
  fullName: "Elsa - Trusted Sister",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "007",
  text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 55,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7d3e568c2cd7e015fe10f8fd4df6d76439d11d52",
  },
  abilities: [
    {
      id: "yr0-1",
      type: "triggered",
      name: "WHAT DO WE DO NOW?",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Anna in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};
