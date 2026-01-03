import type { CharacterCard } from "@tcg/lorcana-types";

export const TeKaHeartless: CharacterCard = {
  id: "pfr",
  cardType: "character",
  name: "Te Ka",
  version: "Heartless",
  fullName: "Te Ka - Heartless",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
      id: "pfr-1",
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
};
