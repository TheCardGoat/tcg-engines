import type { CharacterCard } from "@tcg/lorcana-types";

export const beastFrustratedDesigner: CharacterCard = {
  id: "1u2",
  cardType: "character",
  name: "Beast",
  version: "Frustrated Designer",
  fullName: "Beast - Frustrated Designer",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 136,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "eea594c1f8504db74823bfd75c4ed44f1a518599",
  },
  abilities: [
    {
      id: "1u2-1",
      type: "activated",
      effect: {
        type: "deal-damage",
        amount: 5,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince", "Inventor"],
};
