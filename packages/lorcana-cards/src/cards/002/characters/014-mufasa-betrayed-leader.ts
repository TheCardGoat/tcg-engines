import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaBetrayedLeader: CharacterCard = {
  id: "rn8",
  cardType: "character",
  name: "Mufasa",
  version: "Betrayed Leader",
  fullName: "Mufasa - Betrayed Leader",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "002",
  text: "THE SUN WILL SET When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 14,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "63a29aa0ab62842bfd36595e8ed690cfdc1ed928",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "King"],
};
