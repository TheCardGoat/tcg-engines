import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamOpportunisticEel: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "1vu-1",
      name: "AMBUSH FROM THE DEEP",
      text: "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 77,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 7,
  externalIds: {
    ravensburger: "f47ed6460876358001084645e206b193f75cad8e",
  },
  franchise: "Little Mermaid",
  fullName: "Jetsam - Opportunistic Eel",
  id: "1vu",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jetsam",
  set: "010",
  strength: 6,
  text: "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.",
  version: "Opportunistic Eel",
  willpower: 6,
};
