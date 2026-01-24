import type { CharacterCard } from "@tcg/lorcana-types";

export const teKHeartless: CharacterCard = {
  id: "bmj",
  cardType: "character",
  name: "Te Kā",
  version: "Heartless",
  fullName: "Te Kā - Heartless",
  inkType: ["steel"],
  franchise: "Moana",
  set: "001",
  text: "SEEK THE HEART During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "29e6f53be8b584a90a734c8e03db35d6c7221778",
  },
  abilities: [
    {
      id: "bmj-1",
      type: "triggered",
      name: "SEEK THE HEART",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "SEEK THE HEART During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
};
