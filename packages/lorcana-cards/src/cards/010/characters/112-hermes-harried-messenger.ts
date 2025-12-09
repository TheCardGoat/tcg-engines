import type { CharacterCard } from "@tcg/lorcana";

export const hermesHarriedMessenger: CharacterCard = {
  id: "17j",
  cardType: "character",
  name: "Hermes",
  version: "Harried Messenger",
  fullName: "Hermes - Harried Messenger",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  externalIds: {
    ravensburger: "9ce36fa3156e783f9c693a2e872e588419f40862",
  },
  abilities: [
    {
      id: "17j-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Deity"],
};
