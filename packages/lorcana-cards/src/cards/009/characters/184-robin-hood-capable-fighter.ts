import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodCapableFighter: CharacterCard = {
  id: "qi2",
  cardType: "character",
  name: "Robin Hood",
  version: "Capable Fighter",
  fullName: "Robin Hood - Capable Fighter",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  text: "SKIRMISH {E} — Deal 1 damage to chosen character.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 184,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5f83698b937b20863589246dc016340a7d70828f",
  },
  abilities: [
    {
      id: "qi2-1",
      type: "activated",
      cost: { exert: true },
      effect: {
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
      text: "SKIRMISH {E} — Deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
