import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaTrustedSister: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a character named Anna in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
        type: "conditional",
      },
      id: "yr0-1",
      name: "WHAT DO WE DO NOW?",
      text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 55,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "7d3e568c2cd7e015fe10f8fd4df6d76439d11d52",
  },
  franchise: "Frozen",
  fullName: "Elsa - Trusted Sister",
  id: "yr0",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Elsa",
  set: "007",
  strength: 2,
  text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
  version: "Trusted Sister",
  willpower: 3,
};
