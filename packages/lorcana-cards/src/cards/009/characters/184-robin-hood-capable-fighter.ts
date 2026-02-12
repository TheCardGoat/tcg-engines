import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodCapableFighter: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "qi2-1",
      text: "SKIRMISH {E} — Deal 1 damage to chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 184,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "5f83698b937b20863589246dc016340a7d70828f",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Capable Fighter",
  id: "qi2",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Robin Hood",
  set: "009",
  strength: 1,
  text: "SKIRMISH {E} — Deal 1 damage to chosen character.",
  version: "Capable Fighter",
  willpower: 3,
};
