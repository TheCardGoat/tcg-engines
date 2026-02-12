import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaFightingPrince: CharacterCard = {
  abilities: [
    {
      effect: {
        optionLabels: [
          "Draw 2 cards, then choose and discard 2 cards.",
          "Deal 2 damage to chosen character.",
        ],
        options: [
          {
            amount: 2,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 2,
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
      id: "1sf-1",
      name: "STEP DOWN OR FIGHT When you play this character and",
      text: "STEP DOWN OR FIGHT When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 7,
  externalIds: {
    ravensburger: "e836b4740f7b37d1bb09ffe4674ef38b8b93c2ed",
  },
  franchise: "Lion King",
  fullName: "Simba - Fighting Prince",
  id: "1sf",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Simba",
  set: "003",
  strength: 5,
  text: "STEP DOWN OR FIGHT When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.",
  version: "Fighting Prince",
  willpower: 7,
};
