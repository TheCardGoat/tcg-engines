import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamOpportunisticEel: CharacterCard = {
  id: "1vu",
  cardType: "character",
  name: "Jetsam",
  version: "Opportunistic Eel",
  fullName: "Jetsam - Opportunistic Eel",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  text: "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 77,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f47ed6460876358001084645e206b193f75cad8e",
  },
  abilities: [
    {
      id: "1vu-1",
      type: "triggered",
      name: "AMBUSH FROM THE DEEP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
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
      text: "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
