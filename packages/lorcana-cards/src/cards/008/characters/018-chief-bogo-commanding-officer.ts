import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoCommandingOfficer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's a character card with cost 5 or less",
        },
        then: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
      },
      id: "17e-1",
      text: "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
      type: "action",
    },
  ],
  cardNumber: 18,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 6,
  externalIds: {
    ravensburger: "9c728cf42b8669fbff70c74afadcb565ef3b0e1a",
  },
  franchise: "Zootropolis",
  fullName: "Chief Bogo - Commanding Officer",
  id: "17e",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Chief Bogo",
  set: "008",
  strength: 5,
  text: "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
  version: "Commanding Officer",
  willpower: 5,
};
