import type { CharacterCard } from "@tcg/lorcana-types";

export const teKHeartless: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "bmj-1",
      name: "SEEK THE HEART",
      text: "SEEK THE HEART During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "29e6f53be8b584a90a734c8e03db35d6c7221778",
  },
  franchise: "Moana",
  fullName: "Te Kā - Heartless",
  id: "bmj",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Te Kā",
  set: "001",
  strength: 5,
  text: "SEEK THE HEART During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
  version: "Heartless",
  willpower: 5,
};
