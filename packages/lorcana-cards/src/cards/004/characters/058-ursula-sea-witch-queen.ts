import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaSeaWitchQueen: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "ay4-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
  cost: 7,
  externalIds: {
    ravensburger: "27753ec5988e180c10bd43600c45c2fb844dd27f",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula - Sea Witch Queen",
  id: "ay4",
  inkType: ["amethyst"],
  inkable: true,
  lore: 3,
  missingImplementation: true,
  missingTests: true,
  name: "Ursula",
  set: "004",
  strength: 4,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Ursula.)\nNOW I AM THE RULER! Whenever this character quests, exert chosen character.\nYOU'LL LISTEN TO ME! Other characters can't exert to sing songs.",
  version: "Sea Witch Queen",
  willpower: 7,
};
