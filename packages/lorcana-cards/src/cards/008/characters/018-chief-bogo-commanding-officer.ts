import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoCommandingOfficer: CharacterCard = {
  id: "17e",
  cardType: "character",
  name: "Chief Bogo",
  version: "Commanding Officer",
  fullName: "Chief Bogo - Commanding Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "008",
  text: "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 18,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9c728cf42b8669fbff70c74afadcb565ef3b0e1a",
  },
  abilities: [],
  classifications: ["Storyborn"],
};
