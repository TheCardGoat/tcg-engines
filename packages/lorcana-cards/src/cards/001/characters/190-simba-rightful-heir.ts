import type { CharacterCard } from "@tcg/lorcana-types";

export const simbarightfulHeir: CharacterCard = {
  id: "ac0",
  cardType: "character",
  name: "Simba",
  version: "Rightful Heir",
  fullName: "Simba - Rightful Heir",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 190,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
      id: "ac0-1",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Prince"],
};
