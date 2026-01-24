import type { CharacterCard } from "@tcg/lorcana-types";

export const belleBookworm: CharacterCard = {
  id: "1rv",
  cardType: "character",
  name: "Belle",
  version: "Bookworm",
  fullName: "Belle - Bookworm",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 71,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e62d9c43e5fbd5aceee5fad79ab1e069b8c412dc",
  },
  abilities: [
    {
      id: "1rv-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
