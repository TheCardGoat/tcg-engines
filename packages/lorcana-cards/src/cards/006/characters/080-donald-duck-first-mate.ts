import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckFirstMate: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1rl-1",
      text: "CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 80,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "e534e9076f10a41b2d0332d7612419ea08d5de99",
  },
  fullName: "Donald Duck - First Mate",
  id: "1rl",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "006",
  strength: 2,
  text: "CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.",
  version: "First Mate",
  willpower: 3,
};
