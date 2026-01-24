import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaSeaWitchQueen: CharacterCard = {
  id: "ay4",
  cardType: "character",
  name: "Ursula",
  version: "Sea Witch Queen",
  fullName: "Ursula - Sea Witch Queen",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Ursula.)\nNOW I AM THE RULER! Whenever this character quests, exert chosen character.\nYOU'LL LISTEN TO ME! Other characters can't exert to sing songs.",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 3,
  cardNumber: 58,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "27753ec5988e180c10bd43600c45c2fb844dd27f",
  },
  abilities: [
    {
      id: "ay4-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
};
