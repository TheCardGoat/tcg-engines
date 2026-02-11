import type { CharacterCard } from "@tcg/lorcana-types";

export const belleBookworm: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      id: "1rv-1",
      text: "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 71,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "e62d9c43e5fbd5aceee5fad79ab1e069b8c412dc",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Bookworm",
  id: "1rv",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Belle",
  set: "002",
  strength: 2,
  text: "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.",
  version: "Bookworm",
  willpower: 4,
};
