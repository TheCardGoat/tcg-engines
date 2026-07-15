import type { CharacterCard } from "@tcg/lorcana-types";

export const beastFrustratedDesigner: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 5,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1u2-1",
      text: "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 136,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince", "Inventor"],
  cost: 6,
  externalIds: {
    ravensburger: "eea594c1f8504db74823bfd75c4ed44f1a518599",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Frustrated Designer",
  id: "1u2",
  inkType: ["ruby", "sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Beast",
  set: "007",
  strength: 5,
  text: "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.",
  version: "Frustrated Designer",
  willpower: 5,
};
